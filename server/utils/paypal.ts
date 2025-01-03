import express from "express";
import fetch, { Response } from "node-fetch"; // Import `Response` from `node-fetch`
import "dotenv/config";
import paypal from '@paypal/checkout-server-sdk';
import agencyModal, { IAgency } from "../Model/agency.modal";

// Update the environment based on production or sandbox mode
const environment = process.env.DEPLOYMENT === 'production'
  ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID!, process.env.PAYPAL_CLIENT_SECRET!)
  : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID!, process.env.PAYPAL_CLIENT_SECRET!);

const client = new paypal.core.PayPalHttpClient(environment);

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const base: string = process.env.DEPLOYMENT === 'production'
  ? "https://api-m.paypal.com"  // Live PayPal API
  : "https://api-m.sandbox.paypal.com";  // Sandbox PayPal API

const app = express();

// Parse post params sent in body in json format
app.use(express.json());

interface PayPalAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface PurchaseUnit {
  amount: {
    currency_code: string;
    value: string;
  };
}

interface CreateOrderPayload {
  intent: "CAPTURE";
  purchase_units: PurchaseUnit[];
}

// Generate an OAuth 2.0 access token
const generateAccessToken = async (): Promise<string | undefined> => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
    ).toString("base64");

    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = (await response.json()) as PayPalAccessTokenResponse;
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};

// Create an order to start the transaction
export const createOrder = async (cart: any): Promise<any> => {
  const accessToken = await generateAccessToken();
  if (!accessToken) {
    throw new Error("Failed to retrieve access token.");
  }

  const url = `${base}/v2/checkout/orders`;
  const payload: CreateOrderPayload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "9.9",
        },
      },
    ],
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

// Capture payment for the created order
export const captureOrder = async (orderID: string, agency_id: string): Promise<any> => {
  const accessToken = await generateAccessToken();
  if (!accessToken) {
    throw new Error("Failed to retrieve access token.");
  }

  const url = `${base}/v2/checkout/orders/${orderID}/capture`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseData = await response.json(); 

    if (!response.ok) {
      throw new Error(`PayPal API error: ${JSON.stringify(responseData)}`);
    }

    const captureStatus = responseData.purchase_units?.[0]?.payments?.captures?.[0]?.status;
    if (captureStatus === 'COMPLETED') {
      const agency: IAgency | null = await agencyModal.findByIdAndUpdate(agency_id, {
        subscriptionExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        isPay: true,
        lastPay: new Date(),
      }, { new: true });
      return responseData; 
    } else {
      throw new Error('Payment was not completed.');
    }
  } catch (error) {
    console.error("Error capturing order:", error);
    throw new Error("Failed to capture order. Please check server logs for details.");
  }
};

// Handle the response from PayPal API
async function handleResponse(response: Response): Promise<any> {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

// Refund order function
export const refundOrder = async (orderID: string) => {
  try {
    const request = new paypal.payments.CapturesRefundRequest(orderID);
    request.requestBody({
      amount: {
        value: '9.9',
        currency_code: 'USD',
      },
      invoice_id: 'your_invoice_id',
      note_to_payer: 'Refund for your order'
    });

    const response = await client.execute(request);

    return {
      jsonResponse: response.result,
      httpStatusCode: response.statusCode
    };
  } catch (error: any) {
    console.error("PayPal refund error:", error);
    throw new Error("Refund failed");
  }
};
