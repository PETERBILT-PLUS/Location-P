import { PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface CartItem {
    sku: string;
    quantity: number;
}

function MyPaypalButton() {
    const SERVER: string = import.meta.env.VITE_SERVER as string;
    const [message, setMessage] = useState<string>("");
    const agency = useSelector((state: any) => state.auth.agency.currentAgency);
    const navigate = useNavigate();

    const createOrder = async (): Promise<string> => {
        try {
            const response = await fetch(`${SERVER}/my-server/create-paypal-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cart: [
                        {
                            sku: "ALFA", // Replace with actual SKU
                            quantity: 1, // Replace with actual quantity
                        } as CartItem,
                    ],
                }),
            });

            const orderData = await response.json();

            if (response.ok) {
                return orderData.id; // Return order ID for PayPal
            } else {
                const errorDetail = orderData.details?.[0];
                const errorMessage = errorDetail
                    ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                    : JSON.stringify(orderData);

                throw new Error(errorMessage);
            }
        } catch (error: any) {
            console.error("Error during order creation:", error);
            setMessage(`Could not initiate PayPal Checkout: ${error.message}`);
            throw error; // Re-throw the error
        }
    };

    const onApprove = async (data: any): Promise<void> => {
        try {
            if (!agency?._id) {
                throw new Error("Agency ID is not available.");
            }

            const response = await fetch(`${SERVER}/api/orders/${data.orderID}/capture`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    agency_id: agency._id,
                }),
            });

            const orderData = await response.json();

            if (response.ok) {
                const transaction = orderData.purchase_units[0].payments.captures[0];
                setMessage(`Transaction ${transaction.status}: ${transaction.id}.`);
                console.log("Capture result:", orderData);
                if (orderData.status === "COMPLETED") {
                    toast.success("Payment Succès");
                    toast.info("Si vous avez un probleme contacter nous");
                    navigate("/login-agent");
                }
            } else {
                console.error("Capture response error:", orderData); // Log full response on error
                const errorDetail = orderData.details?.[0];
                throw new Error(
                    errorDetail ? `${errorDetail.description} (${orderData.debug_id})` : JSON.stringify(orderData)
                );
            }
        } catch (error: any) {
            console.error("Error in onApprove:", error);
            setMessage(`Sorry, your transaction could not be processed: ${error.message}`);
        }
    };

    return (
        <div>
            <PayPalButtons
                createOrder={createOrder}
                onApprove={onApprove}
            />
            {message && <p>{message}</p>} {/* Display messages */}
        </div>
    );
}

export default MyPaypalButton;
