import { useEffect, useLayoutEffect, useState } from 'react';
import { faCar } from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt, faBell } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSocketContext } from '../../Context/SocketContext';


function AdminDashboard() {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>(null);
    const SERVER: string = import.meta.env.VITE_SERVER as string;
    const agency = useSelector((state: any) => state.auth.agency.currentAgency);
    const socket = useSocketContext();

    useLayoutEffect(() => {
        document.title = "Tableau de Board";
    }, []);


    useEffect(() => {
        const getDashboard = async () => {
            setLoading(true);
            try {
                const res: AxiosResponse<any, any> = await axios.get(`${SERVER}/agent/get-dashboard`, { withCredentials: true });
                console.log(res.data);
                if (res.data.success) {
                    setData(res.data.data);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.warning(error.response?.data?.message);
                } else {
                    toast.error("Ops Une Erreur");
                    console.error(error);
                }
            } finally {
                setLoading(false);
            }
        }

        getDashboard();
    }, []);

    useEffect(() => {
        if (!socket?.socket) {
            console.error("Socket is not connected.");
            return;
        }

        const handleSocket = (newNotification: any) => {
            console.log("Received new notification via socket:", newNotification);

            // Use functional form of setData to ensure proper state update
            setData((prev: any) => ({
                ...prev,
                notification: prev.notification + 1,
            }));
            toast.info("Vous Avez une Nouvelle Notification");
        };

        // Listen for the 'newNotification' event
        socket.socket.on("newNotification", handleSocket);

        // Cleanup listener on unmount
        return () => {
            if (socket?.socket) {
                socket.socket.off("newNotification", handleSocket);
            }
        };
    }, [socket]);

    if (loading) {
        return (
            <div className="bg-white min-vh-100 d-flex flex-row justify-content-center align-items-center">
                <Spinner></Spinner>
            </div>
        );
    }

    return (
        <div className="bg-light">
            <Container className="py-5">
                <h4 className="text-center mb-4">Bienvenue, {agency.nom} {agency.prenom}</h4>
                <p className="text-center mb-5">Veillez accepter les réservations et voir vos messages depuis votre tableau de bord.</p>
                <Row xs={1} md={3} className="g-4">
                    <Col>
                        <Link to="reservations" style={{ textDecoration: "none" }}>
                            <Card className="shadow h-100">
                                <Card.Header className="py-3 text-center bg-primary text-white">Reservations</Card.Header>
                                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                                    <Card.Text className="mb-0">{data?.reservations} {data?.reservation > 1 ? "Nouvelle Réservations" : "Nouvelle Réservation"}</Card.Text>
                                    <FontAwesomeIcon icon={faCalendarAlt} className="text-muted mt-3 fs-4" />
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                    <Col>
                        <Link to="vehicules" style={{ textDecoration: "none" }}>
                            <Card className="shadow h-100">
                                <Card.Header className="py-3 text-center bg-secondary text-white">Vehicules</Card.Header>
                                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                                    <Card.Text className="mb-0">{data?.cars} {data?.cars > 1 ? "Vehicules" : "Vehicule"}</Card.Text>
                                    <FontAwesomeIcon icon={faCar} className="text-muted mt-3 fs-4" />
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                    <Col>
                        <Link to="notifications" style={{ textDecoration: "none" }}>
                            <Card className="shadow h-100">
                                <Card.Header className="py-3 text-center bg-danger text-white">Notifications</Card.Header>
                                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                                    <Card.Text className="mb-0">{data?.notification} {data?.notification > 1 ? "Nouvelles Notifications" : "Nouvelle Notification"}</Card.Text>
                                    <FontAwesomeIcon icon={faBell} className="text-muted mt-3 fs-4" />
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default AdminDashboard;
