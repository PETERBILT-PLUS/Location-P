import axios, { AxiosResponse } from "axios";
import { useEffect, useLayoutEffect, useState } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSocketContext } from "../../Context/SocketContext";

function UserReservations() {
    const SERVER: string = import.meta.env.VITE_SERVER as string;
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const socket = useSocketContext();

    console.log(data);

    useLayoutEffect(() => {
        document.title = "Mes Réservations";
    }, []);

    useEffect(() => {
        if (socket) {
            // Define the event handler separately
            const handleReservationUpdate = (reservation: any) => {
                console.log(reservation);
                const newData = data.map((elem: any) =>
                    String(elem._id) === String(reservation._id)
                        ? { ...elem, status: reservation.status }  // Return a new object with updated status
                        : elem
                );
                setData(newData);
                toast.success(`Reservation ${reservation.status}`);
            };

            // Add event listener
            socket?.socket?.on("acceptDelineReservation", handleReservationUpdate);

            // Clean up event listener
            return () => {
                socket?.socket?.off("acceptDelineReservation", handleReservationUpdate);
            };
        }
    }, [socket, data]);  // Include `data` in the dependency array


    useEffect(() => {
        const getUserReservations = async () => {
            setLoading(true);
            try {
                const res: AxiosResponse<any, any> = await axios.get(`${SERVER}/user/get-reservations`, { withCredentials: true });
                console.log(res.data);

                if (res.data.success) {
                    setData(res.data.reservations);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.warning(error.response?.data.message);
                } else {
                    console.error(error);
                    toast.error("Ops! An Error Happened While Fetching Reservations");
                }
            } finally {
                setLoading(false);
            }
        };

        getUserReservations();
    }, []);

    if (loading) {
        return (
            <div className="min-vh-100 d-flex flex-row justify-content-center align-items-center">
                <Spinner></Spinner>
            </div>
        );
    }

    return (
        <div className="min-vh-100 py-5 bg-light">
            <Container>
                <h2 className="text-center fs-3 text-primary pt-3 pb-5">Mes Réservations</h2>
                <Row>
                    {data.length > 0 ? (
                        data.map((elem: any, index: number) => {
                            return (
                                <Col key={index} className="shadow px-0">
                                    <Row>
                                        <Col xs={12} lg={4} className="flex flex-row justfy-content-cen">
                                            <img src={elem.car.carPhotos[0]} alt={elem.car.carName} className="w-100 h-auto" style={{ borderTopLeftRadius: "5px", borderBottomLeftRadius: "5px" }} />
                                        </Col>

                                        <Col xs={12} lg={8}>
                                            <h4 className="card-title py-3">Voiture Réservée</h4>
                                            <p className="card-text">
                                                <strong>Dates: </strong>{new Date(elem.timeStart).toLocaleDateString()} - {new Date(elem.timeEnd).toLocaleDateString()}<br />
                                                <strong>Total Jours: </strong>{elem.totalDays} {elem.totalDays === 1 ? "Jour" : "jours"}<br />
                                                <strong>Prix Total: </strong>{elem.priceTotal} DH<br />
                                                <strong>Numéro de téléphone: </strong>{elem.phoneNumber}<br />
                                                <strong>Status: </strong><mark>{elem.status}</mark>
                                            </p>
                                        </Col>
                                    </Row>
                                </Col>
                            );
                        })
                    ) : (
                        <p className="text-center">Aucune réservation trouvée.</p>
                    )}
                </Row>
            </Container>
        </div>
    );
}

export default UserReservations;
