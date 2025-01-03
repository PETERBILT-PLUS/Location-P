import { useEffect, useLayoutEffect, useState } from 'react';
import { faCar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Col, Container, Modal, Row } from 'react-bootstrap';
import "./AgenceAdminVehicule.css";
import { Link } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

function AgenceAdminVehicules() {
    const SERVER: string = import.meta.env.VITE_SERVER as string;
    const [data, setData] = useState<any[]>([]);
    const [show, setShow] = useState(false);
    const [selectedCarId, setSelectedCarId] = useState<string | null>(null);

    useLayoutEffect(() => {
        document.title = "Vehicules";
    }, []);

    const handleClose = () => setShow(false);
    const handleShow = (carId: string) => {
        setSelectedCarId(carId);
        setShow(true);
    };

    const handleDelete = async () => {
        if (selectedCarId) {
            try {
                const res: AxiosResponse<any, any> = await axios.delete(`${SERVER}/agent/delete-car/${selectedCarId}`, { withCredentials: true });
                if (res.data.success) {
                    toast.success('Voiture supprimée avec succès');
                    setData(data.filter(car => car._id !== selectedCarId));
                    handleClose();
                }
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    toast.warning(error.response?.data.message);
                } else {
                    console.error(error);
                    toast.error(error?.message);
                }
            }
        }
    };

    useEffect(() => {
        const getAgencyCars = async () => {
            try {
                const res: AxiosResponse<any, any> = await axios.get(`${SERVER}/agent/get-cars`, { withCredentials: true });
                if (res.data.success) {
                    setData(res.data.data);
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

        getAgencyCars();
    }, []);

    return (
        <div>
            <div className="py-5 d-flex justify-content-center">
                <Container>
                    <Row xs={1} md={3} lg={4} className="g-4">
                        <Col>
                            <Card className="shadow h-100">
                                <Card.Header className="py-3 text-center bg-primary text-white">Vehicules</Card.Header>
                                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                                    <Card.Text className="mb-0">{data.length === 0 ? null : data.length } {!data.length ? "Pas De Voitures" : data.length === 1 ? "Vehicule" : "Vehicules"}</Card.Text>
                                    <FontAwesomeIcon icon={faCar} className="text-muted mt-3 fs-4" />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className="py-5">
                <Container>
                    <h1 className="text-center title display-6 pb-5 pt-3">Votre Voitures</h1>
                    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                        {data.length ? (
                            data.map((elem: any) => {
                                return (
                                    <Col key={elem._id}>
                                        <Card className="shadow h-100">
                                            <Card.Img 
                                                variant="top" 
                                                src={elem.carPhotos[0]} 
                                                style={{ objectFit: "cover", height: "200px" }} 
                                            />
                                            <Card.Body>
                                                <Card.Title className="text-primary">Nom: {elem.carName}</Card.Title>
                                                <Card.Text>Marque: {elem.carMarque}</Card.Text>
                                                <Card.Text>Etat: {elem.carEtat}</Card.Text>
                                                <div className="d-flex justify-content-center align-items-center border-top pt-3 gap-5">
                                                    <Link to={`/agence-dashboard/edit-vehicule/${elem._id}`}>
                                                        <button className="edit-car-btn btn btn-sm btn-outline-primary">Modifier</button>
                                                    </Link>
                                                    <button 
                                                        className="delete-car-btn btn btn-sm btn-outline-danger" 
                                                        onClick={() => handleShow(elem._id)}
                                                    >
                                                        Supprimer
                                                    </button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })
                        ) : (
                            <h2 className="text-primary text-center w-100">Pas De Voitures</h2>
                        )}
                    </Row>
                </Container>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmation de Suppression</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Êtes-vous sûr de vouloir supprimer ce véhicule ?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Annuler
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Supprimer
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default AgenceAdminVehicules;
