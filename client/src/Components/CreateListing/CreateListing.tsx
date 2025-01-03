import React, { useLayoutEffect } from 'react';
import { Form, Button, Container, Row, Image } from 'react-bootstrap';
import "./CreateListing.css";
import { FormikHelpers, useFormik } from 'formik';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../../Configuration/firebase.ts";
import { toast } from 'react-toastify';
import { createListingSchema } from '../../Configuration/createListingShema.ts';
import SubmitButton from '../../SubComponents/SubmitButton/SubmitButton.tsx';
import { carMarques, typesVoitures } from '../../Configuration/values.ts';
import axios, { AxiosResponse } from 'axios';



interface IImageFile extends File {
    name: string,
}

export interface FormValues {
    carPhotos: string[]; // Array of file paths or URLs
    carName: string;
    carFuel: string;
    carMarque: string;
    places: string; // Changed to string as it's bound to a form control
    carType: string;
    carKm: string; // Changed to string as it's bound to a form control
    pricePerDay: string; // Changed to string as it's bound to a form control
    carEtat: string;
    registration: {
        registrationNumber: string;
        registrationDate: string;
        registrationExpiration: string;
        vehicleIdentificationNumber: string;
    };
    insurance: {
        insuranceCompany: string;
        policyNumber: string;
        expirationDate: string;
    };
}


function CreateListing() {
    const [uploadByte, setUploadByte] = React.useState<number>(0);
    const [imageLoading, setImageLoading] = React.useState<boolean>(false);
    const [files, setFiles] = React.useState<any>([]);
    const SERVER: string = import.meta.env.VITE_SERVER as string;

    useLayoutEffect(() => {
        document.title = "Ajouter un Vehicule";
    }, []);

    const handleImageSubmit = () => {
        if (files.length > 0 && files.length + values.carPhotos.length < 7) {
            const promises: Promise<string>[] = []; // Define promises array explicitly
            setImageLoading(true);
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImages(files[i]));
            }
            Promise.all(promises).then((urls: string[]) => {
                const updatedValues = {
                    ...values,
                    carPhotos: [...values.carPhotos, ...urls] // Append new image URLs to the existing ones
                };
                setValues(updatedValues); // Update form values
            });
        } else {
            toast.warning("Maximum 7 images");
        }
    }

    const storeImages = async (file: IImageFile): Promise<string> => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on("state_changed", (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadByte(progress);
            }, (error) => {
                reject(error);
                setUploadByte(0);
                setImageLoading(false);
            }, () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                    setUploadByte(0);
                    setImageLoading(false);
                });
            }
            );

        });
    }

    const handleRemoveImage = (index: number) => {
        const updatedPhotos = [...values.carPhotos]; // Create a copy of the carPhotos array
        updatedPhotos.splice(index, 1); // Remove the image URL at the specified index
        const updatedValues = {
            ...values,
            carPhotos: updatedPhotos, // Update carPhotos with the modified array
        }
        setValues(updatedValues); // Set the updated values
    }


    const onSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
        if (values.carPhotos.length < 3) return toast.warning("Minimum 3 photos");
        try {
            const res: AxiosResponse<any> = await axios.post(`${SERVER}/cars/create-listing`, values, { withCredentials: true });
            if (res.data.success) {
                actions.resetForm();
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

    const { handleSubmit, handleBlur, setValues, handleChange, isSubmitting, values, errors, touched } = useFormik<FormValues>({
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
        validationSchema: createListingSchema,
        onSubmit,
    });


    return (
        <div className="create-listing-wrapper">

            <Container className="py-5">
                <h1 className="title text-center display-6 pb-5 pt-3">Ajouter un Vehicule</h1>
                <Row className="border mx-3 py-4 rounded">
                    <div className="col-12 col-md-6">
                        <Form onSubmit={handleSubmit} className="mb-4">
                            <Form.Group className="mb-3">
                                <Form.Label className="px-1">Nom de voiture</Form.Label>
                                <Form.Control type="text" onChange={handleChange} onBlur={handleBlur} value={values.carName} name="carName" placeholder="Nom de voiture" />
                                {errors.carName && touched.carName && <h6 className="text-danger py-2 px-1">{errors.carName}</h6>}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="px-1">Type du carburant</Form.Label>
                                <Form.Select defaultValue="" onChange={handleChange} onBlur={handleBlur} value={values.carFuel} name="carFuel">
                                    <option disabled value="">Type du carburant</option>
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
                                    <option disabled value="">Marque du véhicule</option>
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
                                    <option disabled value="">Type de voiture</option>
                                    {typesVoitures.map((elem, index) => (
                                        <option key={index}>{elem}</option>
                                    ))}
                                </Form.Select>
                                {errors.carType && touched.carType && <h6 className="text-danger py-2 px-1">{errors.carType}</h6>}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="px-1">Kilométrage</Form.Label>
                                <Form.Control type="number" placeholder="Kilométrage" onChange={handleChange} onBlur={handleBlur} name="carKm" />
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
                                    <option disabled value="">État de Vehicule</option>
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
                                <Form.Control type="date" value={values.registration?.registrationDate} onChange={handleChange} onBlur={handleBlur} name="registration.registrationDate" />
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

                    </div>
                    <div className="col-12 col-md-6">
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
                    </div>
                </Row>
            </Container>
        </div >
    )
}

export default CreateListing;
