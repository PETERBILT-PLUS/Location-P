import { useLayoutEffect } from "react";
import { Container, Form, Row } from "react-bootstrap";
import "./RegisterAgent.css";
import { useFormik } from "formik";
import SubmitButton from "../../../SubComponents/SubmitButton/SubmitButton.tsx";
import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { agentProfileSchema } from "../../../Configuration/agentProfile.ts";

function RegisterAgent() {
    const navigate = useNavigate();
    const SERVER: string = import.meta.env.VITE_SERVER as string;

    useLayoutEffect(() => {
        document.title = "Register (Agence)";
    }, []);

    const cities = [
        "Agadir", "Al Hoceima", "Asilah", "Azemmour", "Azrou",
        "Beni Mellal", "Ben Slimane", "Berkane", "Berrechid",
        "Casablanca", "Chefchaouen", "Dakhla", "El Aioun",
        "El Hajeb", "El Jadida", "El Kelaa des Sraghna",
        "Errachidia", "Essaouira", "Fes", "Guelmim", "Ifrane",
        "Khemisset", "Khenifra", "Khouribga", "Laayoune",
        "Larache", "Marrakech", "Meknes", "Mohammedia",
        "Nador", "Ouarzazate", "Ouezzane", "Oujda",
        "Rabat", "Safi", "Sale", "Sefrou", "Settat",
        "Sidi Bennour", "Sidi Ifni", "Sidi Kacem", "Sidi Slimane",
        "Skhirat", "Tangier", "Tan-Tan", "Taourirt",
        "Taroudant", "Taza", "Tetouan", "Tiznit", "Zagora"
    ];

    const onSubmit = async (values: any, action: any) => {
        try {
            const res: AxiosResponse<any, any> = await axios.post(`${SERVER}/agent/register`, values, { withCredentials: true });
            if (res.data.success) {
                toast.success("Registrement Succès");
                action.resetForm();
                navigate("/login-agent");
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

    const { values, errors, touched, handleBlur, handleChange, handleSubmit, isSubmitting } = useFormik({
        initialValues: {
            nom: "",
            prenom: "",
            email: "",
            password: "",
            confirmPassword: "",
            telephone: "",
            adress: "",
            ville: "",
            website: "",
            numeroDinscription: "",
            numeroDeLisenceCommercial: "",
            NumeroDePoliceDassurance: "",
            localisation: "",
            paypalAccountId: "",
        },
        validationSchema: agentProfileSchema,
        onSubmit,
    });

    return (
        <section className="register-section bg-light py-5">
            <Container>
                <h3 className="text-center text-light title py-5">Register Votre Agence</h3>
                <Row>
                    <div className="col-11 col-md-6 col-lg-5 col-xlg-4 mx-auto">
                        <Form className="agent-register-form mx-auto" onSubmit={handleSubmit}>
                            <Form.Group controlId="nom">
                                <Form.Label>Nom</Form.Label>
                                <Form.Control
                                    className="input-form"
                                    type="text"
                                    name="nom"
                                    value={values.nom}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                />
                                {errors.nom && touched.nom && <h6 className="text-danger error-header">{errors.nom}</h6>}
                            </Form.Group>

                            <Form.Group controlId="prenom">
                                <Form.Label>Prénom</Form.Label>
                                <Form.Control
                                    className="input-form"
                                    type="text"
                                    name="prenom"
                                    value={values.prenom}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                />
                                {errors.prenom && touched.prenom && <h6 className="text-danger error-header">{errors.prenom}</h6>}
                            </Form.Group>

                            <Form.Group controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    className="input-form"
                                    type="email"
                                    name="email"
                                    value={values.email}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                />
                                {errors.email && touched.email && <h6 className="text-danger error-header">{errors.email}</h6>}
                            </Form.Group>

                            <Form.Group controlId="password">
                                <Form.Label>Mot de passe</Form.Label>
                                <Form.Control
                                    className="input-form"
                                    type="password"
                                    name="password"
                                    value={values.password}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                />
                                {errors.password && touched.password && <h6 className="text-danger error-header">{errors.password}</h6>}
                            </Form.Group>

                            <Form.Group controlId="confirmPassword">
                                <Form.Label>Confirmer le mot de passe</Form.Label>
                                <Form.Control
                                    className="input-form"
                                    type="password"
                                    name="confirmPassword"
                                    value={values.confirmPassword}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                />
                                {errors.confirmPassword && touched.confirmPassword && <h6 className="text-danger error-header">{errors.confirmPassword}</h6>}
                            </Form.Group>

                            <Form.Group controlId="telephone">
                                <Form.Label>Téléphone</Form.Label>
                                <Form.Control
                                    className="input-form"
                                    type="tel"
                                    name="telephone"
                                    value={values.telephone}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                />
                                {errors.telephone && touched.telephone && <h6 className="text-danger error-header">{errors.telephone}</h6>}
                            </Form.Group>

                            <Form.Group controlId="adress">
                                <Form.Label>Adresse</Form.Label>
                                <Form.Control
                                    className="input-form"
                                    type="text"
                                    name="adress"
                                    value={values.adress}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                />
                                {errors.adress && touched.adress && <h6 className="text-danger error-header">{errors.adress}</h6>}
                            </Form.Group>

                            <Form.Group controlId="ville">
                                <Form.Label>Ville</Form.Label>
                                <Form.Select
                                    className="form-select"
                                    name="ville"
                                    value={values.ville}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                >
                                    <option value="" disabled>Choisir La Ville</option>
                                    {cities.map((elem, idx) => (
                                        <option key={idx}>{elem}</option>
                                    ))}
                                </Form.Select>
                                {errors.ville && touched.ville && <h6 className="text-danger error-header pt-2">{errors.ville}</h6>}
                            </Form.Group>

                            <Form.Group controlId="website">
                                <Form.Label>Site Web</Form.Label>
                                <Form.Control
                                    className="input-form"
                                    type="url"
                                    name="website"
                                    value={values.website}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                />
                                {errors.website && touched.website && <h6 className="text-danger error-header">{errors.website}</h6>}
                            </Form.Group>

                            <Form.Group controlId="numeroDinscription">
                                <Form.Label>Numéro d'Inscription</Form.Label>
                                <Form.Control
                                    className="input-form"
                                    type="text"
                                    name="numeroDinscription"
                                    value={values.numeroDinscription}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                />
                                {errors.numeroDinscription && touched.numeroDinscription && <h6 className="text-danger error-header">{errors.numeroDinscription}</h6>}
                            </Form.Group>

                            <Form.Group controlId="numeroDeLisenceCommercial">
                                <Form.Label>Numéro de Licence Commerciale</Form.Label>
                                <Form.Control
                                    className="input-form"
                                    type="text"
                                    name="numeroDeLisenceCommercial"
                                    value={values.numeroDeLisenceCommercial}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                />
                                {errors.numeroDeLisenceCommercial && touched.numeroDeLisenceCommercial && <h6 className="text-danger error-header">{errors.numeroDeLisenceCommercial}</h6>}
                            </Form.Group>

                            <Form.Group controlId="NumeroDePoliceDassurance">
                                <Form.Label>Numéro de Police d'Assurance</Form.Label>
                                <Form.Control
                                    className="input-form"
                                    type="text"
                                    name="NumeroDePoliceDassurance"
                                    value={values.NumeroDePoliceDassurance}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                />
                                {errors.NumeroDePoliceDassurance && touched.NumeroDePoliceDassurance && <h6 className="text-danger error-header">{errors.NumeroDePoliceDassurance}</h6>}
                            </Form.Group>

                            <Form.Group controlId="localisation">
                                <Form.Label>Localisation</Form.Label>
                                <Form.Control
                                    className="input-form"
                                    type="text"
                                    name="localisation"
                                    value={values.localisation}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                />
                                {errors.localisation && touched.localisation && <h6 className="text-danger error-header">{errors.localisation}</h6>}
                            </Form.Group>

                            <Form.Group controlId="paypalAccountId">
                                <Form.Label>ID de Compte PayPal</Form.Label>
                                <Form.Control
                                    className="input-form"
                                    type="text"
                                    name="paypalAccountId"
                                    value={values.paypalAccountId}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                />
                                {errors.paypalAccountId && touched.paypalAccountId && <h6 className="text-danger error-header">{errors.paypalAccountId}</h6>}
                            </Form.Group>

                            <SubmitButton disabled={isSubmitting} loading={isSubmitting} />

                            <p className="pt-4 text-secondary">Vous Avez Déja un compte <Link to="/login-agent">Connection</Link></p>
                        </Form>
                    </div>
                </Row>
            </Container>
        </section>
    );
}

export default RegisterAgent;
