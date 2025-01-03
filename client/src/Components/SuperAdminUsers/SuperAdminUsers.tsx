import axios, { AxiosResponse } from 'axios';
import { useEffect, useLayoutEffect, useState } from 'react'
import { Card, Col, Container, Image, Row, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function SuperAdminUsers() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const SERVER: string = import.meta.env.VITE_SERVER as string;

    useLayoutEffect(() => {
        document.title = "Utilisateurs";
    }, []);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const res: AxiosResponse<any> = await axios.get(`${SERVER}/super-admin/get-users`, { withCredentials: true });
                if (res.data.success) {
                    setUsers(res.data.users);
                    console.log(res.data.users);
                }
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    toast.warning(error.response?.data.message);
                } else {
                    console.error(error);
                    toast.error(error?.message || "Ops An Error Happend");
                }
            } finally {
                setLoading(false);
            }
        };

        getUsers();
    }, []);

    const getMoreUsers = async () => {
        try {
            const res: AxiosResponse<{ success: boolean, users: any[], message?: string }> = await axios.get(`${SERVER}/super-admin/get-users?skip=${users.length}`, { withCredentials: true });
            if (res.data.success) {
                setUsers((prev: any) => [...prev, res.data.users]);
            }
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data.message);
            } else {
                console.error(error);
                toast.error(error?.message || "Ops An Error Happend");
            }
        }
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, offsetHeight, scrollHeight } = e.currentTarget;

        if (scrollTop + offsetHeight >= scrollHeight - 1) {
            getMoreUsers();
            console.log("scroll to the bottom");
            
        }
    };

    const deleteUser = async (user_id: string) => {
        try {
            if (!user_id) return toast.warning("Utilisateur est Manqué");
            const res: AxiosResponse<{ success: boolean, message?: string }> = await axios.delete(`${SERVER}/super-admin/delete-user?id=${user_id}`, { withCredentials: true });
            if (res.data.success) {
                setUsers((prev) => prev.filter((elem: any) => elem._id !== user_id));
                toast.success("Utilisateur Supprimer Avec Succès");
            }
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data.message);
            } else {
                console.error(error);
                toast.error(error?.message);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-vh-100 bg-light d-flex flex-row justify-content-center align-items-center">
                <Spinner></Spinner>
            </div>
        );
    }
    return (
        <div className="min-vh-100 py-5 bg-light" style={{ height: "100vh", overflowY: "scroll" }} onScroll={handleScroll}>
            <Container>

                <h1 className="fs-3 text-center pb-5 pt-2" style={{ color: "var(--lightBlue)" }}>Utilisateurs:</h1>
                {!loading && users.length === 0 && <h2 className="fs-4 text-center text-secondary">Pas D'utilisateurs</h2>}

                <Row xs={1} md={2} className="g-4" >
                    {!!users.length && users.map((elem: any, index: number) => {
                        return (
                            <>
                                <Col key={index}>
                                    <Card className="w-100 bg-white shadow">
                                        <Card.Header className="py-2">

                                            <Row>
                                                <Col xs={6} className="d-flex flex-row justify-content-center align-items-center">
                                                    <Card.Title>Nom: <span className="text-primary">{elem.nom} {elem.prenom}</span></Card.Title>
                                                </Col>
                                                <Col xs={6} className="d-flex flex-row justify-content-center align-items-center">
                                                    <Image src={elem.profilePicture} alt={elem.nom} style={{ width: "84px", height: "84px" }} />
                                                </Col>
                                            </Row>
                                        </Card.Header>
                                        <Card.Body className="d-flex flex-column justify-content-center align-items-center py-4 gap-3">
                                            <Card.Text>E-mail: {elem.email}</Card.Text>
                                            <Card.Text>Sexe: {elem.sexe}</Card.Text>
                                        </Card.Body>
                                        <Card.Footer className="d-flex flex-row justify-content-center align-items-center gap-4">
                                            <button type="button" className="btn btn-danger w-50 py-2 fs-6 fs-md-5" onClick={() => deleteUser(elem._id)}>Supprimer</button>
                                            <Link to={`/super-admin/get-user-reservations/${elem._id}`} className="w-50">
                                                <button type="button" className="btn btn-primary w-100 py-2 fs-6 fs-md-5">{elem.reservations.length} {elem.reservations.length > 1 ? "Réservations" : "Réservation"}</button>
                                            </Link>
                                        </Card.Footer>
                                    </Card>
                                </Col>
                            </>
                        );
                    })}
                </Row>

            </Container>
        </div>
    )
}

export default SuperAdminUsers;
