import axios, { AxiosResponse } from "axios";
import { useEffect, useLayoutEffect, useState } from "react";
import { Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSocketContext } from "../../Context/SocketContext";


function AgencyNotifications() {
    const [loading, setLoading] = useState<boolean>(true);
    const [notifications, setNotifications] = useState<any[]>([]);
    const SERVER: string = import.meta.env.VITE_SERVER as string;
    const socket = useSocketContext();

    useLayoutEffect(() => {
        document.title = "Notifications";
    }, []);

    useEffect(() => {
        const getNotifications = async () => {
            try {
                const res: AxiosResponse<any> = await axios.get(`${SERVER}/agent/get-notifications`, { withCredentials: true });
                if (res.data.success) {
                    setNotifications(res.data.data);
                }
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    toast.warning(error.response?.data?.message);
                } else {
                    console.error(error);
                    toast.error(error?.message);
                }
            } finally {
                setLoading(false);
            }
        }

        getNotifications();
    }, []);

    useEffect(() => {
        const updateNotifications = async () => {
            try {
                const res: AxiosResponse<any> = await axios.post(`${SERVER}/agent/update-notifications`, null, { withCredentials: true });
                if (res.data.success) {
                    return true;
                }
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    toast.warning(error.response?.data.message || "An error occurred.");
                } else {
                    toast.error(error?.message || "An unexpected error occurred.");
                    console.error(error);
                }
            }
        };

        // Call the async function inside useEffect
        updateNotifications();
    }, []); // Empty dependency array means this runs once on component mount.

    useEffect(() => {
        if (!socket?.socket) return;
        const handleNotification = (newNotification: any) => {
            setNotifications((prevNotifications) => [newNotification, ...prevNotifications]); // Add new notification at the start
            toast.info("Vous avez une Nouvelle Notification!");
        };

        socket?.socket.on("newNotification", handleNotification);

        return () => {
            if (!socket?.socket) return;
            socket?.socket.off("newNotification", handleNotification); // Clean up the listener when component unmounts
        };
    }, [socket]);

    if (loading) {
        return (
            <div className="min-vh-100 bg-white d-flex flex-direction-row justify-content-center align-items-center">
                <Spinner></Spinner>
            </div>
        );
    }

    return (
        <div className="py-5 bg-light">
            <Container>
                <h2 className="fs-2 text-center ">Notifications:</h2>
                {!notifications.length && !loading && <h3 className="text-secondary text-center pt-5">Pas De Notifications</h3>}

                <Row className="py-5">
                    {!!notifications.length && notifications.map((elem: any, index: number) => {
                        return (
                            <Col xs={12} lg={6} key={index}>
                                <Card className="m-3 shadow">
                                    <Card.Title className="p-4 text-center">
                                        {elem.message}
                                    </Card.Title>
                                    <Card.Footer className="text-center">
                                        {new Date(elem.createdAt).toLocaleString()}
                                    </Card.Footer>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </Container>
        </div>
    )
}

export default AgencyNotifications;