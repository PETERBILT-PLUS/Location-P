import axios, { AxiosResponse } from "axios";
import { useEffect, useLayoutEffect, useState } from "react";
import { Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Payment() {
    const agent = useSelector((state: any) => state.auth.agency.currentAgency);
    const SERVER: string = import.meta.env.VITE_SERVER as string;
    const [loading, setLoading] = useState<boolean>(false);
    const [tryFree, setTryFree] = useState<boolean>();
    const navigate = useNavigate();

    useLayoutEffect(() => {
        document.title = "Payment";
    }, []);

    useEffect(() => {
        const getState = async () => {
            setLoading(true);
            try {
                const res: AxiosResponse<any, any> = await axios.get(`${SERVER}/agent-state/get-payment-state`, { withCredentials: true });
                if (res.data.success) {
                    setTryFree(res.data.tryFree);
                }                
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    toast.warning(error.response?.data.message);
                } else {
                    console.error(error);
                    toast.error(error.message || "Ops An Error Happend");
                }
            } finally {
                setLoading(false);
            }
        }

        if (agent) getState();
    }, []);

    const handleTryFree = async () => {
        try {
            const res: AxiosResponse<{ success: boolean, message: string }> = await axios.post(`${SERVER}/agent/try-free`, null, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/agence-dashboard");
            }
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data.message);
            } else {
                console.error(error);
                toast.error(error?.message || "Ops Erreur Interne");
            }
        }
    };

    const handlePayment = async () => {
        navigate("/confirm-payment");
    };

    if (loading) {
        return (
            <div className="min-vh-100 d-flex flex-direction-row justify-content-center align-items-center">
                <Spinner></Spinner>
            </div>
        );
    }

    return (
        <section className="payment-section bg-light py-5 min-vh-100">
            <Container>
                <Row className="py-5">
                    {/* Free Trial Card */}
                    {!tryFree && <Col xs={12} lg={6} className="mx-auto">
                        <Card className="py-5 px-3">
                            <Card.Title className="text-center py-4 fs-3" style={{ color: "var(--lightBlue)" }}>Essayer Gratuitement</Card.Title>

                            <Card.Body className="d-flex flex-column justify-content-evenly gap-4">
                                <p className="text-center text-secondary">Profitez de toutes les fonctionnalités premium gratuitement pendant 30 jours. Aucune carte de crédit nécessaire.</p>
                                <p className="text-center fs-4" style={{ color: "var(--highBlue)" }}>Essayer Maintenant</p>
                                <hr />
                                <div className="d-flex flex-direction-row justify-content-center">
                                    <button className="btn btn-info align-self-start text-white py-3 px-4" onClick={handleTryFree}>Essayer Gratuitement</button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>}

                    {/* Paid Trial Card */}
                    <Col xs={12} lg={6} className="mx-auto">
                        <Card className="py-5 px-3">
                            <Card.Title className="text-center py-4 fs-3" style={{ color: "var(--lightBlue)" }}>Accès Premium Immédiat</Card.Title>

                            <Card.Body className="d-flex flex-column justify-content-evenly gap-4">
                                <p className="text-center text-secondary">
                                    Passez directement à l'expérience premium pour seulement 9,9$ sans attendre. Si vous n'avez pas de réservation, vous serez remboursé.
                                </p>
                                <p className="text-center fs-4" style={{ color: "var(--highBlue)" }}>Profiter de l'Offre</p>
                                <hr />
                                <div className="d-flex flex-direction-row justify-content-center">
                                    <button className="btn btn-info align-self-start text-white py-3 px-4" onClick={handlePayment}>Essayer Avec 9,9$</button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default Payment;
