import axios, { AxiosResponse } from "axios";
import { useEffect, useLayoutEffect, useState } from "react";
import { Col, Container, Row, Spinner, Card, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSocketContext } from "../../Context/SocketContext";

function AgencyReservations() {
    const SERVER: string = import.meta.env.VITE_SERVER as string;
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const socket = useSocketContext();

    // Set the document title
    useLayoutEffect(() => {
        document.title = "Réservations";
    }, []);
    console.log(reservations);

    // Fetch the agency reservations when the component mounts
    useEffect(() => {
        const getAgencyReservations = async () => {
            try {
                const res: AxiosResponse<any> = await axios.get(`${SERVER}/agent/get-reservations`, { withCredentials: true });
                if (res.data.success) {
                    setReservations(res.data.data);  // Set reservations in state
                }
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    toast.warning(error.response?.data.message);
                } else {
                    toast.error(error?.message);
                    console.error(error);
                }
            } finally {
                setLoading(false);  // Hide spinner after data is loaded
            }
        };

        getAgencyReservations();
    }, []);

    useEffect(() => {
        if (!socket?.socket) return;
        socket?.socket.on("newReservation", (reservation: any) => {
            setReservations((prev) => [...prev, reservation]);
            toast.info("Vous Avez une Nouvelle Réservation");
        });
    }, [socket?.socket]);

    // Handle Accept/Decline of a reservation
    const handleAcceptDecline = async (reservation_id: string, newStatus: string, userId: string) => {
        try {
            console.log(userId);

            if (!reservation_id) return toast.warning("Réservation non trouvée");

            // Send the request to update the reservation status
            const res: AxiosResponse<any> = await axios.post(
                `${SERVER}/agent/update-reservation-status`,
                { reservation_id, status: newStatus, userId: userId },
                { withCredentials: true }
            );

            if (res.data.success) {
                // Immediately update the local state with the new status
                setReservations((prevReservations) =>
                    prevReservations.map((reservation) =>
                        reservation._id === reservation_id
                            ? { ...reservation, status: newStatus }  // Update the reservation with the new status
                            : reservation
                    )
                );
                toast.success(`Statut mis à jour à "${newStatus}"`);
            }
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data.message);
            } else {
                console.error(error);
                toast.error(error.message);
            }
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <div className="bg-light py-5 min-vh-100">
            <Container>
                <h2 className="fs-3 text-center mb-4 pb-5">Réservations</h2>

                <Row className="g-4">
                    {reservations.length > 0 ? (
                        reservations.map((reservation: any, index: number) => (
                            <Col xs={12} md={6} lg={4} key={index}>
                                <Card className="shadow-sm">
                                    <Card.Header className="p-0">
                                        <Card.Img
                                            src={reservation.car.carPhotos[0]}
                                            alt={reservation.car.carName}
                                            style={{ borderBottomRightRadius: "0", borderBottomLeftRadius: "0", objectFit: "cover", height: "220px" }}
                                        />
                                    </Card.Header>
                                    <Card.Body>
                                        <Card.Title>{reservation.car?.carName || "Voiture"}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">
                                            {reservation.car?.carMarque}
                                        </Card.Subtitle>
                                        <Card.Text>
                                            <strong>Agence:</strong> {reservation.agency.nom} {reservation.agency.prenom}
                                            <br />
                                            <strong>Téléphone:</strong> {reservation.phoneNumber}
                                            <br />
                                            <strong>Statut:</strong><mark className="p-1 rounded"> {reservation.status}</mark>
                                            <br />
                                            <strong>Date de début:</strong> {new Date(reservation.timeStart).toLocaleDateString("fr-FR")}
                                            <br />
                                            <strong>Date de fin:</strong> {new Date(reservation.timeEnd).toLocaleDateString("fr-FR")}
                                            <br />
                                            <strong>Total jours:</strong> {reservation.totalDays}
                                            <br />
                                            <strong>Prix total:</strong> {reservation.priceTotal} DH
                                        </Card.Text>
                                    </Card.Body>
                                    <Card.Footer className="d-flex justify-content-start align-items-center gap-3 py-4">
                                        <Button
                                            variant="primary"
                                            onClick={() => handleAcceptDecline(reservation._id, "Accepté", reservation.user._id)}
                                        >
                                            Accepter
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleAcceptDecline(reservation._id, "Refusé", reservation.user._id)}
                                        >
                                            Refuser
                                        </Button>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col>
                            <p className="text-center">Aucune réservation disponible.</p>
                        </Col>
                    )}
                </Row>
            </Container>
        </div>
    );
}

export default AgencyReservations;
