import axios, { AxiosResponse } from "axios";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Container, Image, Spinner, Alert, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { differenceInDays } from "date-fns";

function SingleCar() {
    const [data, setData] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [phone, setPhone] = useState<string>("");
    const navigate = useNavigate();
    const SERVER: string = import.meta.env.VITE_SERVER as string;
    const params = useParams();

    useLayoutEffect(() => {
        document.title = "Voir Voiture";
    }, []);

    useEffect(() => {
        const getSingleCar = async () => {
            try {
                const res: AxiosResponse<any, any> = await axios.get(`${SERVER}/user/get-single-car/${params.id}`);
                if (res.data.success) {
                    setData(res.data.data);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setError(error.response?.data.message || "An error occurred");
                } else {
                    console.error(error);
                    setError("An unexpected error occurred");
                }
                toast.error("Error occurred while fetching car details");
            } finally {
                setLoading(false);
            }
        };

        getSingleCar();
    }, [params.id, SERVER]);

    const reserveCar = async () => {
        if (!startDate || !endDate || !phone) return toast.warning("Entrer le informations Du date et Votre Télephone");
        try {
            const res: AxiosResponse<any, any> = await axios.post(`${SERVER}/user/add-reservation`, { _id: params.id, startDate, endDate, phone }, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/");
            }
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data.message);
            } else {
                toast.error(error?.message);
                console.error(error);
            }
        }
    }

    if (loading) return <div className="text-center my-5"><Spinner animation="border" variant="primary" /></div>;
    if (error) return <div className="text-center my-5"><Alert variant="danger">{error}</Alert></div>;

    return (
        <div className="min-vh-100 bg-light py-5">
            <Container>
                {/* Swiper for Car Photos */}
                <div className="mb-4">
                    <Swiper
                        modules={[Navigation, Pagination, Scrollbar, A11y]}
                        spaceBetween={10}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        scrollbar={{ draggable: true }}
                        breakpoints={{
                            640: {
                                slidesPerView: 1,
                                spaceBetween: 20,
                            },
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 30,
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 40,
                            },
                        }}
                    >
                        {data?.carPhotos.map((photo: string, index: number) => (
                            <SwiperSlide key={index}>
                                <Image className="w-100 rounded" src={photo} alt={`Car photo ${index}`} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Car Details and Reservation Form */}
                <Row className="pt-4">
                    <Col xs={12} lg={6} className="text-center text-lg-start mb-4">
                        <h1 className="mb-3 fs-4 text-primary">Nom: {data?.carName}</h1>
                        <p className="fs-5 text-secondary">Type De Carburant: {data?.carFuel || "No description available."}</p>
                        <p className="fs-5 text-secondary">Nombre de Places: {data?.places || "No description available."}</p>
                        <p className="fs-5 text-secondary">Kilométrage: {data?.carKm + " Km" || "No information available."}</p>
                        <p className="fs-5 text-secondary">Prix Par Jour: {data?.pricePerDay ? `${data.pricePerDay} DH` : "No information available."}</p>
                        <p className="fs-5 text-secondary">Type: {data?.carType || "No information available."}</p>
                    </Col>

                    <Col xs={12} lg={6}>
                        <div className="mb-4 d-flex flex-column justify-content-evenly align-items-center align-items-lg-start">
                            <h2 className="fs-4 text-primary mb-3">Réserver ce véhicule</h2>
                            <Form className="d-flex flex-column justify-content-evenly align-items-center align-items-lg-start">
                                <Form.Group className="mb-3">
                                    <Form.Label className="px-2">Début de la Réservation</Form.Label>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date: Date | null) => setStartDate(date)}
                                        className="form-control"
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="px-2">Fin de la Réservation</Form.Label>
                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date: Date | null) => setEndDate(date)}
                                        className="form-control"
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </Form.Group>
                                <Form.Group className="py-2">
                                    {startDate && endDate && <span className="text-primary fs-4 py-3">Total: {differenceInDays(endDate, startDate) * data.pricePerDay} DH</span>}
                                </Form.Group>
                                <Form.Group className="pt-2">
                                    <Form.Label>Télephone: </Form.Label>
                                    <Form.Control type="text" placeholder="télephone" className="mb-3 mt-2" value={String(phone)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)} />
                                </Form.Group>
                                <Button variant="primary" type="button" onClick={reserveCar}>Réserver</Button>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default SingleCar;
