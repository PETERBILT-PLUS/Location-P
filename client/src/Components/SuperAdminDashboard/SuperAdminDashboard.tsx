import axios, { AxiosResponse } from 'axios';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { FaRegUser } from "react-icons/fa";
import { IoNewspaper } from "react-icons/io5";
import { FaStoreAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';



function SuperAdminDashboard() {
    const SERVER: string = import.meta.env.VITE_SERVER as string;
    const [users, setUsers] = useState<number | null>(null);
    const [agencys, setAgencys] = useState<number | null>(null);
    const [reservations, setReservations] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const token: string | undefined = localStorage.getItem("token") || undefined;

    useLayoutEffect(() => {
        document.title = "Super Admin Dashboard";
    }, []);

    useEffect(() => {
        const getSuperAdminDashboard = async () => {
            try {
                setLoading(true);
                const res: AxiosResponse<{ success: boolean, data: any, message?: string }> = await axios.get(`${SERVER}/super-admin/get-dashboard`, { withCredentials: true, params: { token: token } });
                console.log(res.data);

                if (res.data.success) {
                    setUsers(res.data.data.users[0]?.total ? res.data.data.users[0]?.total : []);
                    setAgencys(res.data.data.agencys[0]?.total ? res.data.data.agencys[0]?.total : []);
                    setReservations(res.data.data.reservations[0]?.total ? res.data.data.reservations[0]?.total : []);
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

        getSuperAdminDashboard();
    }, []);

    if (loading) {
        return (
            <div className="min-vh-100 bg-light d-flex flex-direction-row justify-content-center align-items-center">
                <Spinner></Spinner>
            </div>
        );
    }

    return (
        <div className="py-5 bg-light" style={{ height: "100vh", overflowY: "scroll" }}>
            {/* Use Container fluid to ensure full width without padding */}
            <Container fluid className="px-4 mx-auto">
                <h1 className="text-center fs-3 pt-2 pb-5" style={{ color: "var(--lightBlue)" }}>Super Admin DashBoard</h1>

                <Row xs={12} md={6} lg={4}>
                    <Col xs={12} md={6} lg={4} className="my-3">
                        <Link to="/super-admin/utilisateurs" style={{ textDecoration: "none" }}>
                            <Card>
                                <Card.Header className="bg-primary py-4 d-flex flex-row justify-content-center align-items-center">
                                    <FaRegUser size={26} color="#fefefe" />
                                </Card.Header>
                                <Card.Body>
                                    <Card.Title className="text-center text-primary py-3">{users == 0 ? 0 : users} {!!users && users > 1 ? "Utilisateurs" : "Utilisateur"}</Card.Title>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>

                    <Col xs={12} md={6} lg={4} className="my-3">
                        <Link to="/super-admin/agences" style={{ textDecoration: "none" }}>
                            <Card>
                                <Card.Header className="bg-success py-4 d-flex flex-row justify-content-center align-items-center">
                                    <FaStoreAlt size={26} color="#fefefe" />
                                </Card.Header>
                                <Card.Body>
                                    <Card.Title className="text-center text-primary py-3">{agencys == 0 ? 0 : agencys} {!!agencys && agencys > 1 ? "Agences" : "Agence"}</Card.Title>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>

                    <Col xs={12} md={6} lg={4} className="my-3">
                        <Link to="/super-admin/reservations" style={{ textDecoration: "none" }}>
                            <Card>
                                <Card.Header className="bg-dark py-4 d-flex flex-row justify-content-center align-items-center">
                                    <IoNewspaper size={26} color="#fefefe" />
                                </Card.Header>
                                <Card.Body>
                                    <Card.Title className="text-center text-primary py-3">{reservations == 0 ? 0 : reservations} {!!reservations && reservations > 1 ? "Réservations" : "Réservation"}</Card.Title>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default SuperAdminDashboard;
