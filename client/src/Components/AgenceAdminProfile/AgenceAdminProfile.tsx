import { useEffect, useLayoutEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import SubmitButton from '../../SubComponents/SubmitButton/SubmitButton';
import { useFormik } from 'formik';
import { IAgentProfile, agentProfileSchema } from '../../Configuration/agentProfile';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

function AgenceAdminProfile() {
    const cities: string[] = [
        "Agadir",
        "Al Hoceima",
        "Asilah",
        "Azemmour",
        "Azrou",
        "Beni Mellal",
        "Ben Slimane",
        "Berkane",
        "Berrechid",
        "Casablanca",
        "Chefchaouen",
        "Dakhla",
        "El Aioun",
        "El Hajeb",
        "El Jadida",
        "El Kelaa des Sraghna",
        "Errachidia",
        "Essaouira",
        "Fes",
        "Guelmim",
        "Ifrane",
        "Khemisset",
        "Khenifra",
        "Khouribga",
        "Laayoune",
        "Larache",
        "Marrakech",
        "Meknes",
        "Mohammedia",
        "Nador",
        "Ouarzazate",
        "Ouezzane",
        "Oujda",
        "Rabat",
        "Safi",
        "Sale",
        "Sefrou",
        "Settat",
        "Sidi Bennour",
        "Sidi Ifni",
        "Sidi Kacem",
        "Sidi Slimane",
        "Skhirat",
        "Tangier",
        "Tan-Tan",
        "Taourirt",
        "Taroudant",
        "Taza",
        "Tetouan",
        "Tiznit",
        "Zagora"
    ];
    const SERVER: string = import.meta.env.VITE_SERVER as string;

    useLayoutEffect(() => {
        document.title = "Profile";
    }, []);


    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const res: AxiosResponse<any, any> = await axios.get(`${SERVER}/agent/get-agent-profile`, { withCredentials: true });
                if (res.data.success) {
                    console.log(res.data);

                    const profileData = res.data.agence;
                    setValues({
                        nom: profileData.nom || '',
                        prenom: profileData.prenom || '',
                        email: profileData.email || '',
                        password: '', // Do not set password on load
                        confirmPassword: '', // Do not set confirmPassword on load
                        telephone: profileData.phoneNumber || '',
                        adress: profileData.address || '', // Ensure this matches the API response
                        ville: profileData.city || '',
                        website: profileData.website || '',
                        numeroDinscription: profileData.registrationNumber || '',
                        numeroDeLisenceCommercial: profileData.businessLicenseNumber || '',
                        NumeroDePoliceDassurance: profileData.insurancePolicyNumber || '',
                        paypalAccountId: profileData.paypalAccountId || '',
                        localisation: profileData.localisation || '',
                    });
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

        getUserProfile();
    }, []);


    const onSubmit = async (state: IAgentProfile) => {
        try {
            const res: AxiosResponse<any, any> = await axios.post(`${SERVER}/agent/updateProfile`, state, { withCredentials: true });
            if (res.data.success) {
                toast.success("Profile Améliorer avec Succès");
            }

        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data?.message);
            } else {
                console.error(error);
                toast.error(error?.message);
            }
        }
    }

    const { isSubmitting, values, errors, touched, setValues, handleChange, handleBlur, handleSubmit } = useFormik<IAgentProfile>({
        validationSchema: agentProfileSchema,
        initialValues: {
            nom: '',
            prenom: '',
            email: '',
            password: '',
            confirmPassword: '',
            telephone: '',
            adress: '',
            ville: '',
            website: '',
            numeroDinscription: '',
            numeroDeLisenceCommercial: '',
            NumeroDePoliceDassurance: '',
            paypalAccountId: '',
            localisation: '',
        },
        onSubmit,
    });

    return (
        <div className="px-0">
            <Row className="py-5 justify-content-center w-100">
                <Col xs={11} md={7} lg={5} className="justify-self-center">
                    <Form onSubmit={handleSubmit} className="border rounded px-4 py-2">
                        <Form.Group className="py-2" controlId="formNom">
                            <Form.Label className="pt-2" htmlFor="nom">Nom :</Form.Label>
                            <Form.Control type="text" placeholder="Votre nom" name="nom" id="nom" onChange={handleChange} onBlur={handleBlur} value={values.nom} />
                            {errors.nom && touched.nom && <p className="text-danger small pt-2">{errors.nom}</p>}
                        </Form.Group>

                        {/* Prénom */}
                        <Form.Group className="py-2" controlId="formPrenom">
                            <Form.Label className="pt-2" htmlFor="prenom">Prénom :</Form.Label>
                            <Form.Control type="text" placeholder="Votre prénom" name="prenom" id="prenom" onChange={handleChange} onBlur={handleBlur} value={values.prenom} />
                            {errors.prenom && touched.prenom && <p className="text-danger small pt-2">{errors.prenom}</p>}
                        </Form.Group>

                        {/* Email */}
                        <Form.Group className="py-2" controlId="formEmail">
                            <Form.Label className="pt-2" htmlFor="email">E-mail :</Form.Label>
                            <Form.Control type="email" placeholder="Votre e-mail" name="email" id="email" onChange={handleChange} onBlur={handleBlur} value={values.email} />
                            {errors.email && touched.email && <p className="text-danger small pt-2">{errors.email}</p>}
                        </Form.Group>

                        {/* Password */}
                        <Form.Group className="py-2" controlId="formPassword">
                            <Form.Label className="pt-2">Mot de passe :</Form.Label>
                            <Form.Control type="password" placeholder="Votre mot de passe" name="password" onChange={handleChange} onBlur={handleBlur} value={values.password} />
                            {errors.password && touched.password && <p className="text-danger small pt-2">{errors.password}</p>}
                        </Form.Group>

                        {/* Confirm Password */}
                        <Form.Group className="py-2" controlId="formConfirmPassword">
                            <Form.Label className="pt-2">Confirmer votre mot de passe :</Form.Label>
                            <Form.Control type="password" placeholder="Confirmer votre mot de passe" name="confirmPassword" onChange={handleChange} onBlur={handleBlur} value={values.confirmPassword} />
                            {errors.confirmPassword && touched.confirmPassword && <p className="text-danger small pt-2">{errors.confirmPassword}</p>}
                        </Form.Group>

                        {/* Telephone */}
                        <Form.Group className="py-2" controlId="formPhoneNumber">
                            <Form.Label className="pt-2">Téléphone :</Form.Label>
                            <Form.Control type="tel" placeholder="Votre téléphone" name="telephone" onChange={handleChange} onBlur={handleBlur} value={values.telephone} />
                            {errors.telephone && touched.telephone && <p className="text-danger small pt-2">{errors.telephone}</p>}
                        </Form.Group>

                        {/* Adresse */}
                        <Form.Group className="py-2" controlId="formAddress">
                            <Form.Label className="pt-2">Adresse :</Form.Label>
                            <Form.Control type="text" placeholder="Votre adresse" name="adress" onChange={handleChange} onBlur={handleBlur} value={values.adress} />
                            {errors.adress && touched.adress && <p className="text-danger small pt-2">{errors.adress}</p>}
                        </Form.Group>

                        {/* Ville */}
                        <Form.Group className="py-2" controlId="formCity">
                            <Form.Label className="pt-2">Ville :</Form.Label>
                            <Form.Select defaultValue="" className="form-select" name="ville" onChange={handleChange} onBlur={handleBlur} value={values.ville}>
                                <option value="" disabled>Choisir La Ville</option>
                                {cities.map((city, idx) => (
                                    <option key={idx} value={city}>{city}</option>
                                ))}
                            </Form.Select>
                            {errors.ville && touched.ville && <p className="text-danger small pt-2">{errors.ville}</p>}
                        </Form.Group>

                        {/* Site Web */}
                        <Form.Group className="py-2" controlId="formWebsite">
                            <Form.Label className="pt-2">Site Web :</Form.Label>
                            <Form.Control type="text" placeholder="Votre site Web" name="website" onChange={handleChange} onBlur={handleBlur} value={values.website} />
                        </Form.Group>

                        {/* Numéro d'inscription */}
                        <Form.Group className="py-2" controlId="formRegistrationNumber">
                            <Form.Label className="pt-2">Numéro d'inscription :</Form.Label>
                            <Form.Control type="text" placeholder="Numéro d'inscription" name="numeroDinscription" onChange={handleChange} onBlur={handleBlur} value={values.numeroDinscription} />
                            {errors.numeroDinscription && touched.numeroDinscription && <p className="text-danger small pt-2">{errors.numeroDinscription}</p>}
                        </Form.Group>

                        {/* Numéro de licence commerciale */}
                        <Form.Group className="py-2" controlId="formBusinessLicenseNumber">
                            <Form.Label className="pt-2">Numéro de licence commerciale :</Form.Label>
                            <Form.Control type="text" placeholder="Numéro de licence commerciale" name="numeroDeLisenceCommercial" onChange={handleChange} onBlur={handleBlur} value={values.numeroDeLisenceCommercial} />
                            {errors.numeroDeLisenceCommercial && touched.numeroDeLisenceCommercial && <p className="text-danger small pt-2">{errors.numeroDeLisenceCommercial}</p>}
                        </Form.Group>

                        {/* Numéro de police d'assurance */}
                        <Form.Group className="py-2" controlId="formInsurancePolicyNumber">
                            <Form.Label className="pt-2">Numéro de police d'assurance :</Form.Label>
                            <Form.Control type="text" placeholder="Numéro de police d'assurance" name="NumeroDePoliceDassurance" onChange={handleChange} onBlur={handleBlur} value={values.NumeroDePoliceDassurance} />
                            {errors.NumeroDePoliceDassurance && touched.NumeroDePoliceDassurance && <p className="text-danger small pt-2">{errors.NumeroDePoliceDassurance}</p>}
                        </Form.Group>

                        <Form.Group className="py-2" controlId="paypalAccountId">
                            <Form.Label className="pt-2">Compte Paypal Id :</Form.Label>
                            <Form.Control type="text" placeholder="Numéro de police d'assurance" name="paypalAccountId" onChange={handleChange} onBlur={handleBlur} value={values.paypalAccountId} />
                            {errors.paypalAccountId && touched.paypalAccountId && <p className="text-danger small pt-2">{errors.paypalAccountId}</p>}
                        </Form.Group>

                        <Form.Group className="py-2" controlId="formInsurancePolicyNumber">
                            <Form.Label className="pt-2">Localisation : (Google Maps)</Form.Label>
                            <Form.Control type="text" placeholder="Numéro de police d'assurance" name="localisation" onChange={handleChange} onBlur={handleBlur} value={values.localisation} />
                            {errors.localisation && touched.localisation && <p className="text-danger small pt-2">{errors.localisation}</p>}
                        </Form.Group>

                        <SubmitButton disabled={isSubmitting} loading={isSubmitting} />
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default AgenceAdminProfile;
