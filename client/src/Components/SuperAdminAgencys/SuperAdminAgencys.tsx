import axios, { AxiosResponse } from "axios";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

// Define a type for the agency object
interface Agency {
    nom: string;
    prenom: string;
    email: string;
    phoneNumber: string;
    address: string;
    city: string;
    businessLicenseNumber: string;
    registrationNumber: string;
    insurancePolicyNumber: string;
    paypalAccountId: string;
    lastPay: string;
    subscriptionExpiresAt: string;
    isPay: boolean;
    tryFree: boolean;
    website?: string;
    createdAt: string;
    updatedAt: string;
    notifications: string[];
}

function SuperAdminAgencys() {
    const [loading, setLoading] = useState<boolean>(true);
    const [agencys, setAgencys] = useState<Agency[]>([]);
    const SERVER: string = import.meta.env.VITE_SERVER as string;

    useLayoutEffect(() => {
        document.title = "Agences";
    }, []);

    useEffect(() => {
        const getAgencys = async () => {
            try {
                const res: AxiosResponse<{ success: boolean; agencys: Agency[] }> = await axios.get(`${SERVER}/super-admin/get-agencys`, { withCredentials: true });
                if (res.data.success) {
                    setAgencys(res.data.agencys);
                    console.log(res.data.agencys);
                }
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    toast.warning(error.response?.data.message);
                } else {
                    console.error(error);
                    toast.error(error?.message);
                }
            } finally {
                setLoading(false);
            }
        };

        getAgencys();
    }, [SERVER]);

    const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
        const { offsetHeight, scrollTop, scrollHeight } = e.currentTarget;

        // Detect when the user reaches the bottom of the scrollable container
        if (offsetHeight + scrollTop >= scrollHeight - 10) {
            try {
                console.log("working hahaha");
                
                const res: AxiosResponse<{ success: boolean, agencys: Agency[] }> = await axios.get(`${SERVER}/super-admin/get-agencys?skip=${agencys.length}`, { withCredentials: true });
                if (res.data.success) {
                    setAgencys((prev: any) => [...prev, ...res.data.agencys]);
                }
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    toast.warning(error.response?.data.message);
                } else {
                    console.error(error);
                    toast.error(error?.message);
                }
            }
        }
    };

    return (
        <div className="py-5 bg-light min-vh-100" style={{ height: "100vh", overflowY: "auto" }} onScroll={handleScroll}>
            <Container>
                <h1 className="fs-3 text-center pb-5 pt-2" style={{color: "var(--lightBlue)"}}>Agences:</h1>

                {/* Display loading spinner or the agencies list */}
                {loading ? (
                    <div className="min-vh-100 d-flex flex-direction-row justify-content-center align-items-center">
                        <Spinner></Spinner>
                    </div>
                ) : (
                    <Row xs={1} md={2}>
                        {agencys.length > 0 ? (
                            agencys.map((elem, index) => (
                                <Col key={index} xs={12} md={6} className="mb-4">
                                    <Card className="shadow bg-light">
                                        <Card.Header>
                                            <Card.Title className="fs-4 text-success pt-3">Nom: {elem.nom} {elem.prenom}</Card.Title>
                                            <p className="text-muted">Email: {elem.email}</p>
                                        </Card.Header>
                                        <Card.Body>
                                            <p><strong>Phone Number:</strong> {elem.phoneNumber}</p>
                                            <p><strong>Address:</strong> {elem.address}, {elem.city}</p>
                                            <p><strong>Business License Number:</strong> {elem.businessLicenseNumber}</p>
                                            <p><strong>Registration Number:</strong> {elem.registrationNumber}</p>
                                            <p><strong>Insurance Policy Number:</strong> {elem.insurancePolicyNumber}</p>
                                            <p><strong>PayPal Account ID:</strong> {elem.paypalAccountId}</p>
                                            <p><strong>Last Pay Date:</strong> {new Date(elem.lastPay).toLocaleString()}</p>
                                            <p><strong>Subscription Expires At:</strong> {new Date(elem.subscriptionExpiresAt).toLocaleString()}</p>
                                            <p><strong>Payment Status:</strong> {elem.isPay ? "Paid" : "Unpaid"}</p>
                                            <p><strong>Subscription Gratuit Status:</strong> {elem.tryFree ? "Paid" : "Unpaid"}</p>
                                            <p><strong>Website:</strong> {elem.website ? elem.website : "N/A"}</p>
                                            <p><strong>Created At:</strong> {new Date(elem.createdAt).toLocaleDateString()}</p>
                                            <p><strong>Updated At:</strong> {new Date(elem.updatedAt).toLocaleDateString()}</p>
                                        </Card.Body>
                                        <Card.Footer>
                                            <p className="text-muted">Notifications: {elem.notifications.length} notifications</p>
                                        </Card.Footer>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <p>No agencies found.</p>
                        )}
                    </Row>
                )}
            </Container>
        </div>
    );
}

export default SuperAdminAgencys;
