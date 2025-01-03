import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Card, Col, Container, Form, InputGroup, Row, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaSearch } from "react-icons/fa";



function SuperAdminReservations() {
    const [loading, setLoading] = useState<boolean>(true);
    const [reservations, setReservations] = useState<any[]>([]);
    const [search, setSearch] = useState<string>("");
    const SERVER: string = import.meta.env.VITE_SERVER as string;

    useLayoutEffect(() => {
        document.title = "Réservations";
    }, []);


    useEffect(() => {
        const getReservations = async () => {
            try {
                const res: AxiosResponse<{ success: boolean, reservations: any[], message?: string }> = await axios.get(`${SERVER}/super-admin/get-reservations?skip=${reservations.length ? reservations.length : 0}`, { withCredentials: true });
                if (res.data.success) {
                    console.log(res.data);
                    setReservations((prev) => [...prev, ...res.data.reservations]);
                }
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    toast.warning(error.response?.data.message);
                } else {
                    console.error(error);
                    toast.error(error?.message || "Ops Error Check The Console");
                }
            } finally {
                setLoading(false);
            }
        };

        getReservations();
    },
        []);

    const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
        try {
            const { scrollTop, scrollHeight, offsetHeight } = e.currentTarget;

            if (scrollTop + offsetHeight >= scrollHeight - 10) {
                console.log("it's workin hahaha");
                
                const res: AxiosResponse<{ success: boolean, reservations: any[], message?: string }> = await axios.get(`${SERVER}/super-admin/get-reservations?skip=${reservations.length}&search=${search}`, { withCredentials: true });
                if (res.data.success) {
                    setReservations((prev) => [...prev, ...res.data.reservations]);
                }
            }
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data.message);
            } else {
                console.error(error);
                toast.error(error?.message || "Ops Error Check The Console");
            }
        }
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const value = e.target.value.trim();
            setSearch(value);
            if (!value) {
                const res: AxiosResponse<{ success: boolean, reservations: any[], message?: string }> = await axios.get(`${SERVER}/super-admin/get-reservations?search=${value}`, { withCredentials: true });
                if (res.data.success) {
                    setReservations([...res.data.reservations]);
                }
                return;
            }

            const res: AxiosResponse<{ success: boolean, reservations: any[], message?: string }> = await axios.get(`${SERVER}/super-admin/get-reservations?search=${value}`, { withCredentials: true });

            // Check if the response status is 204
            if (res.status === 204) {
                console.log("No content returned (204 status)");
                setReservations([]);  // Clear the reservations if no data is returned
            } else if (res.data.success) {
                setReservations([...res.data.reservations]);
            }
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data.message || "Error with Axios request");
            } else {
                console.error("Error occurred:", error);
                toast.error(error?.message || "Ops Error Check The Console");
            }
        }
    };



    if (loading) {
        return (
            <div className="min-vh-100 bg-light d-flex flex-direction-row justify-content-center align-items-center">
                <Spinner></Spinner>
            </div>
        );
    }

    return (
        <div className="py-5 min-vh-100 bg-light mx-0" style={{ overflowY: "auto", height: "100vh", overflowX: "auto" }} onScroll={handleScroll}>
            <h1 className="fs-3 text-center pb-5 pt-3" style={{ color: "var(--lightBlue)" }}>Réservations</h1>

            <div className="bg-white shadow rounded mx-auto px-4 py-2 d-flex justify-content-center align-items-center" style={{ maxWidth: '600px' }}>
                <InputGroup className="w-100">
                    <Form.Control
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
                        className="border-0 shadow-none"
                        placeholder="Search..."
                        aria-label="Search"
                        style={{ borderRadius: '20px 0 0 20px' }}
                    />
                    <InputGroup.Text className="bg-primary text-white border-0" style={{ borderRadius: '0 20px 20px 0' }}>
                        <FaSearch size={20} />
                    </InputGroup.Text>
                </InputGroup>
            </div>


            <Row className="py-5 row mx-0" xs={12}>
                <Container className="py-5">
                    {reservations.length > 0 ? (
                        reservations.map((elem: any, index: number) => {
                            if (!elem.car) {
                                return (
                                    <Col xs={12} className="px-0" key={index} style={{ overflowX: "hidden" }}>
                                        <Card className="px-2 py-2 px-md-0">
                                            <Card.Body className="text-center">
                                                <h5 className="text-danger">La voiture pas trouvé</h5>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            }

                            return (
                                <Col xs={12} className="px-0" key={index} style={{ overflowX: "hidden" }}>
                                    <Card className="px-2 py-2 px-md-0">
                                        <Row xs={12} md={4}>
                                            {/* Car Image Section */}
                                            <Col xs={12} md={4}>
                                                <Card.Header className="px-0 py-0" style={{ height: "100%" }}>
                                                    <Card.Img
                                                        src={elem.car.carPhotos[0]}
                                                        style={{ borderRadius: "", height: "100%", objectFit: "cover" }}
                                                        alt={`${elem.car.carMarque} ${elem.car.carName}`}
                                                    />
                                                </Card.Header>
                                            </Col>

                                            {/* User and Reservation Info */}
                                            <Col xs={12} md={4} className="py-3">
                                                <Card.Title className="text-primary fs-5">
                                                    Nom Client: {elem.user ? elem.user.nom + " " + elem.user.prenom : <p className="text-danger my-3">Utilisateur Supprimer</p>}
                                                </Card.Title>
                                                <Card.Text className="fs-6 text-secondary my-2">
                                                    Tél Client: {elem.phoneNumber}
                                                </Card.Text>
                                                <Card.Text className="fs-6 text-secondary my-2">
                                                    E-mail Client: {elem.user ? elem.user.email : <p className="text-danger my-2">E-mail Pas Disponible</p>}
                                                </Card.Text>
                                                <Card.Text className="fs-6 text-secondary my-2">
                                                    Statut: <span className="bg-success p-2 rounded text-white">{elem.status}</span>
                                                </Card.Text>
                                                <Card.Text className="fs-6 text-secondary my-2">
                                                    Prix Total: {elem.priceTotal} DH
                                                </Card.Text>
                                                <Card.Text className="fs-6 text-secondary my-2">
                                                    Départ: {new Date(elem.timeStart).toLocaleDateString()}
                                                </Card.Text>
                                                <Card.Text className="fs-6 text-secondary my-2">
                                                    Arrivée: {new Date(elem.timeEnd).toLocaleDateString()}
                                                </Card.Text>
                                                <Card.Text className="fs-6 text-secondary my-2">
                                                    Durée Totale: {elem.totalDays} jours
                                                </Card.Text>
                                            </Col>

                                            {/* Car and Agency Info */}
                                            <Col xs={12} md={4} className="py-3">
                                                <Card.Title className="text-primary fs-5 pb-3">
                                                    Voiture: {elem.car.carMarque + " " + elem.car.carName}
                                                </Card.Title>
                                                <Card.Text className="fs-6 text-secondary my-2">
                                                    Carburant: {elem.car.carFuel}
                                                </Card.Text>
                                                <Card.Text className="fs-6 text-secondary my-2">
                                                    Agence: {elem.agency.nom + " " + elem.agency.prenom}
                                                </Card.Text>
                                                <Card.Text className="fs-6 text-secondary my-2">
                                                    E-mail Agence: {elem.agency.email}
                                                </Card.Text>

                                                {/* the card footer */}
                                                <Card.Footer className="bg-white">
                                                    <Card.Text className="fs-5 text-primary">Prix Par Jour: {elem.car.pricePerDay} DH/jour</Card.Text>
                                                </Card.Footer>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            );
                        })
                    ) : (
                        <div className="text-center">
                            <h5 className="text-muted">Aucune réservation trouvée.</h5>
                        </div>
                    )}
                </Container>
            </Row>

        </div>
    )
}

export default SuperAdminReservations;