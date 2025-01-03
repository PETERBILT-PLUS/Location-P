import { Card, Col, Container, Row } from "react-bootstrap";
import MyPaypalButton from "../../SubComponents/MyPaypalButton/MyPaypalButton.tsx";
import { useLayoutEffect } from "react";

function ConfirmPayment() {

    useLayoutEffect(() => {
        document.title = "Payment";
    }, []);

    return (
        <div className="py-5 bg-light min-vh-100">
            <Container>
                <Row className="py-5">
                    <Col className="mx-auto" xs={12} md={6} lg={4}>
                        <Card className="px-5 py-4 text-center shadow">
                            <Card.Title style={{ color: "var(--lightBlue)" }} className="fs-3 py-4">Paiement de 9,9$</Card.Title>
                            <Card.Body className="gap-5">
                                <p className="ps-6 pb-4 text-secondary">
                                    Passez directement à l'expérience premium pour seulement 9,9$ sans attendre. Si vous n'avez pas de réservation, vous serez remboursé.
                                </p>
                                {/* PayPal Button Integration */}
                                <MyPaypalButton />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default ConfirmPayment;