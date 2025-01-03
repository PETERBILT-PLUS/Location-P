import { FormikHelpers, useFormik } from "formik";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { createListingSchema } from "../../Configuration/createListingShema";
import { FormValues } from "../CreateListing/CreateListing";
import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { carMarques, typesVoitures } from "../../Configuration/values";
import SubmitButton from "../../SubComponents/SubmitButton/SubmitButton";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../../Configuration/firebase";
import { useEffect, useLayoutEffect, useState } from "react";

function EditVehicule() {
    const SERVER: string = import.meta.env.VITE_SERVER as string;
    const [files, setFiles] = useState<any>([]);
    const [uploadByte, setUploadByte] = useState<number>(0);
    const [imageLoading, setImageLoading] = useState<boolean>(false);
    const params = useParams();

    useLayoutEffect(() => {
        document.title = "Modifier un Vehicule";
    }, []);

    useEffect(() => {
        const getVehiculeDetails = async () => {
            try {
                const res: AxiosResponse<any, any> = await axios.get(`${SERVER}/agent/get-single-car/${params.id}`, { withCredentials: true });
                console.log(res.data);
                
                if (res.data.success) {
                    const car = res.data.data;
    
                    setValues({
                        carName: car.carName,
                        carEtat: car.carEtat,
                        carFuel: car.carFuel,
                        carKm: car.carKm, // No need to convert if number is acceptable
                        carMarque: car.carMarque,
                        carPhotos: car.carPhotos,
                        carType: car.carType,
                        places: car.places, // No need to convert if number is acceptable
                        insurance: {
                            insuranceCompany: car.insurance.insuranceCompany,
                            policyNumber: car.insurance.policyNumber,
                            expirationDate: car.insurance.expirationDate
                                ? new Date(car.insurance.expirationDate).toISOString().slice(0, 10) // Convert to YYYY-MM-DD
                                : "", // Default value
                        },
                        pricePerDay: car.pricePerDay, // No need to convert if number is acceptable
                        registration: {
                            registrationNumber: car.registration.registrationNumber,
                            registrationDate: car.registration.registrationDate
                                ? new Date(car.registration.registrationDate).toISOString().slice(0, 10) // Convert to YYYY-MM-DD
                                : "", // Default value
                            registrationExpiration: car.registration.registrationExpiration
                                ? new Date(car.registration.registrationExpiration).toISOString().slice(0, 10) // Convert to YYYY-MM-DD
                                : "", // Default value
                            vehicleIdentificationNumber: car.registration.vehicleIdentificationNumber,
                        },
                    });
                }
            } catch (error) {
                console.error("Error fetching vehicle details", error);
            }
        };
    
        getVehiculeDetails();
    }, []);
    
    


    const handleImageSubmit = () => {
        if (files.length > 0 && files.length + values.carPhotos.length <= 7) {
            const promises: Promise<string>[] = [];
            setImageLoading(true);
            files.forEach((file: any) => promises.push(storeImages(file)));
            Promise.all(promises)
                .then((urls: string[]) => {
                    const updatedValues = {
                        ...values,
                        carPhotos: [...values.carPhotos, ...urls]
                    };
                    setValues(updatedValues);
                    setFiles([]); // Clear files after upload
                })
                .catch(() => toast.error("Failed to upload images"))
                .finally(() => setImageLoading(false));
        } else {
            toast.warning("Maximum 7 images allowed.");
        }
    };

    const storeImages = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadByte(progress);
                },
                (error) => {
                    reject(error);
                    setUploadByte(0);
                    setImageLoading(false);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                        setUploadByte(0);
                        setImageLoading(false);
                    });
                }
            );
        });
    };

    const handleRemoveImage = (index: number) => {
        const updatedPhotos = [...values.carPhotos];
        updatedPhotos.splice(index, 1); // Remove the image at the specified index
        setValues({
            ...values,
            carPhotos: updatedPhotos
        });
    };

    const onSubmit = async (state: FormValues, actions: FormikHelpers<FormValues>) => {
        try {
            const res: AxiosResponse<any, any> = await axios.put(`${SERVER}/agent/edit-car?car_id=${params.id}`, state, { withCredentials: true });
            if (res.data.success) {
                toast.success("Vehicule Modifié avec Succès");
                actions.resetForm();
            }
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data.message);
            } else {
                toast.error(error?.message);
                console.error(error);
            }
        }
    };

    const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, setValues } = useFormik<FormValues>({
        validationSchema: createListingSchema,
        initialValues: {
            carName: '',
            carFuel: '',
            carMarque: '',
            carPhotos: [],
            places: '',
            carType: '',
            carKm: '',
            pricePerDay: '',
            carEtat: '',
            registration: {
                registrationNumber: '',
                registrationDate: '',
                registrationExpiration: '',
                vehicleIdentificationNumber: ''
            },
            insurance: {
                insuranceCompany: '',
                policyNumber: '',
                expirationDate: ''
            },
        },
        onSubmit,
    });

    return (
        <div className="">
            <div className="py-5">
                <Container>
                    <Row classname="w-100">
                        <Col xs={12} lg={6}>
                            <Form onSubmit={handleSubmit} autoComplete="off" className="py-5">

                                <Form.Group className="mb-3">
                                    <Form.Label className="px-1">Nom de voiture</Form.Label>
                                    <Form.Control type="text" onChange={handleChange} onBlur={handleBlur} value={values.carName} name="carName" placeholder="Nom de voiture" />
                                    {errors.carName && touched.carName && <h6 className="text-danger py-2 px-1">{errors.carName}</h6>}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="px-1">Type du carburant</Form.Label>
                                    <Form.Select defaultValue="" onChange={handleChange} onBlur={handleBlur} value={values.carFuel} name="carFuel">
                                        <option value="" disabled>Type du carburant</option>
                                        <option>Essence</option>
                                        <option>Diesel</option>
                                        <option>Hybride</option>
                                        <option>Électrique</option>
                                    </Form.Select>
                                    {errors.carFuel && touched.carFuel && <h6 className="text-danger py-2 px-1">{errors.carFuel}</h6>}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="px-1">Marque du véhicule</Form.Label>
                                    <Form.Select defaultValue="" value={values.carMarque} onChange={handleChange} onBlur={handleBlur} name="carMarque">
                                        <option value="" disabled>Marque du véhicule</option>
                                        {carMarques.map((elem, index) => (
                                            <option key={index}>{elem}</option>
                                        ))}
                                    </Form.Select>
                                    {errors.carMarque && touched.carMarque && <h6 className="text-danger py-2 px-1">{errors.carMarque}</h6>}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="px-1">Nombre de places</Form.Label>
                                    <Form.Control type="number" placeholder="Nombre de places" onChange={handleChange} onBlur={handleBlur} value={values.places} name="places" />
                                    {errors.places && touched.places && <h6 className="text-danger py-2 px-1">{errors.places}</h6>}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="px-1">Type de voiture</Form.Label>
                                    <Form.Select defaultValue="" onChange={handleChange} onBlur={handleBlur} value={values.carType} name="carType">
                                        <option value="" disabled>Type de voiture</option>
                                        {typesVoitures.map((elem, index) => (
                                            <option key={index}>{elem}</option>
                                        ))}
                                    </Form.Select>
                                    {errors.carType && touched.carType && <h6 className="text-danger py-2 px-1">{errors.carType}</h6>}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="px-1">Kilométrage</Form.Label>
                                    <Form.Control type="number" placeholder="Kilométrage" onChange={handleChange} onBlur={handleBlur} value={values.carKm} id="carKm" name="carKm" />
                                    {errors.carKm && touched.carKm && <h6 className="text-danger py-2 px-1">{errors.carKm}</h6>}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="px-1">Prix par jour (DH)</Form.Label>
                                    <Form.Control type="number" onChange={handleChange} onBlur={handleBlur} value={values.pricePerDay} placeholder="Prix par jour" name="pricePerDay" />
                                    {errors.pricePerDay && touched.pricePerDay && <h6 className="text-danger py-2 px-1">{errors.pricePerDay}</h6>}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="px-1">Disponibilité du voiture</Form.Label>
                                    <br />
                                    <Form.Text>
                                        Vous devez indiquer si votre voiture est disponible ou en charge pour être visible par les clients.
                                    </Form.Text>
                                    <Form.Select defaultValue="" onChange={handleChange} onBlur={handleBlur} value={values.carEtat} name="carEtat">
                                        <option value="" disabled>État de Vehicule</option>
                                        <option>Disponible</option>
                                        <option>En Charge</option>
                                    </Form.Select>
                                    {errors.carEtat && touched.carEtat && <h6 className="text-danger py-2 px-1">{errors.carEtat}</h6>}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="px-1">Numéro d'immatriculation</Form.Label>
                                    <Form.Control type="text" value={values.registration?.registrationNumber} onChange={handleChange} onBlur={handleBlur} placeholder="Numéro d'immatriculation" name="registration.registrationNumber" />
                                    {errors.registration?.registrationNumber && touched.registration?.registrationNumber && <h6 className="text-danger py-2 px-1">{errors.registration?.registrationNumber}</h6>}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="px-1">Date d'immatriculation</Form.Label>
                                    <Form.Control type="date" value={values.registration?.registrationDate} onChange={handleChange} onBlur={handleBlur}  name="registration.registrationDate" />
                                    {errors.registration?.registrationDate && touched.registration?.registrationDate && <h6 className="text-danger py-2 px-1">{errors.registration?.registrationDate}</h6>}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="px-1">Date d'expiration de l'immatriculation</Form.Label>
                                    <Form.Control type="date" value={values.registration?.registrationExpiration} onChange={handleChange} onBlur={handleBlur} name="registration.registrationExpiration" />
                                    {errors.registration?.registrationExpiration && touched.registration?.registrationExpiration && <h6 className="text-danger py-2 px-1">{errors.registration?.registrationExpiration}</h6>}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="px-1">Numéro d'identification du véhicule</Form.Label>
                                    <Form.Control type="text" value={values.registration?.vehicleIdentificationNumber} onChange={handleChange} onBlur={handleBlur} placeholder="Numéro d'identification du véhicule" name="registration.vehicleIdentificationNumber" />
                                    {errors.registration?.vehicleIdentificationNumber && touched.registration?.vehicleIdentificationNumber && <h6 className="text-danger py-2 px-1">{errors.registration?.vehicleIdentificationNumber}</h6>}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="px-1">Compagnie d'assurance</Form.Label>
                                    <Form.Control type="text" value={values.insurance?.insuranceCompany} onChange={handleChange} onBlur={handleBlur} placeholder="Compagnie d'assurance" name="insurance.insuranceCompany" />
                                    {errors.insurance?.insuranceCompany && touched.insurance?.insuranceCompany && <h6 className="text-danger py-2 px-1">{errors.insurance?.insuranceCompany}</h6>}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="px-1">Numéro de police</Form.Label>
                                    <Form.Control type="text" value={values.insurance?.policyNumber} onChange={handleChange} onBlur={handleBlur} name="insurance.policyNumber" placeholder="Numéro de police" />
                                    {errors.insurance?.policyNumber && touched.insurance?.policyNumber && <h6 className="text-danger py-2 px-1">{errors.insurance?.policyNumber}</h6>}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="px-1">Date d'expiration de l'assurance</Form.Label>
                                    <Form.Control type="date" value={values.insurance?.expirationDate} onChange={handleChange} onBlur={handleBlur} name="insurance.expirationDate" />
                                    {errors.insurance?.expirationDate && touched.insurance?.expirationDate && <h6 className="text-danger py-2 px-1">{errors.insurance?.expirationDate}</h6>}
                                </Form.Group>

                                <SubmitButton disabled={isSubmitting} loading={isSubmitting} />
                            </Form>
                        </Col>

                        <Col xs={12} lg={6} className="py-5">
                            <p className="text-center text-md-start">Veuillez capturer des images de votre voiture sous différents angles (coffre, avant, arrière, etc...). <br />la premire photo sa devient la photo de poster</p>

                            <Form.Group>
                                <Form.Label>Images</Form.Label>
                                <Form.Control type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFiles(e.target.files)} accept="image/*" multiple />
                                {imageLoading && <p className="text-dark fs-6 text-center pt-2">Loading...</p>}
                                {uploadByte ? <p className="text-dark fs-6 text-center pt-2">upload byte {Math.floor(uploadByte)}%</p> : null}
                                <Button type="button" className="my-3 justify-self-center" onClick={handleImageSubmit}>Télécharger</Button>
                                {errors.carPhotos && touched.carPhotos && <h6 className="text-danger py-2">{errors.carPhotos}</h6>}
                            </Form.Group>

                            <Container>
                                {values.carPhotos.length ? (
                                    values.carPhotos.map((elem, index) => {
                                        return (
                                            <div key={index} className="d-flex flex-column justify-between align-center mb-3">
                                                <Image className="rounded mb-2" style={{ height: "auto", maxWidth: "100%" }} src={elem} />
                                                <Button variant="danger" className="align-self-center" style={{ width: "100%", height: "40px" }} onClick={() => handleRemoveImage(index)}>Supprimer</Button>
                                            </div>
                                        );
                                    })
                                ) : null}

                            </Container>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
}

export default EditVehicule;