import { FormikHelpers, useFormik } from "formik";
import { Container, Form, Row } from "react-bootstrap";
import { IRegister, registerSchema } from "../../../Configuration/registerSchema";
import SubmitButton from "../../../SubComponents/SubmitButton/SubmitButton";
import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import { useLayoutEffect } from "react";

function Register() {
    const SERVER: string = import.meta.env.VITE_SERVER as string;
    const navigate = useNavigate();

    useLayoutEffect(() => {
        document.title = "Register (Utilisateur)";
    }, []);

    const onSubmit = async (state: IRegister, actions: FormikHelpers<IRegister>) => {
        try {
            console.log(state);
            const res: AxiosResponse<any, any> = await axios.post(`${SERVER}/auth/register`, state);
            if (res.data.success) {
                toast.success("Compte crée avec Succès");
                await new Promise((resolve) => setInterval(resolve, 3500));
                navigate("/login");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data.message);
            } else {
                console.error(error);
                toast.error("An Error Happend")
            }
        } finally {
            actions.setSubmitting(false);
        }
    }

    const { errors, touched, values, isSubmitting, handleSubmit, handleChange, handleBlur } = useFormik<IRegister>({
        validationSchema: registerSchema,
        initialValues: {
            nom: "",
            prenom: "",
            email: "",
            sexe: "male",
            password: "",
            confirmPassword: "",
        },
        onSubmit,
    });

    return (
        <section className="register-section bg-light py-5 min-vh-100">
            <Container>
                <h3 className="text-center text-light title pb-5 pt-2">Crée un Compte</h3>
                <Row>
                    <div className="col-11 col-md-6 col-lg-5 col-xlg-4 mx-auto">
                        <Form onSubmit={handleSubmit} className="mx-auto bg-white p-5" style={{ borderRadius: "15px" }}>
                            <Form.Group className="py-1">
                                <Form.Label htmlFor="nom">Nom:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nom"
                                    id="nom"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.nom}
                                    isInvalid={!!errors.nom && touched.nom}
                                />
                                {errors.nom && touched.nom && <Form.Control.Feedback type="invalid">{errors.nom}</Form.Control.Feedback>}
                            </Form.Group>

                            <Form.Group className="py-1">
                                <Form.Label htmlFor="prenom">Prénom:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="prenom"
                                    id="prenom"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.prenom}
                                    isInvalid={!!errors.prenom && touched.prenom}
                                />
                                {errors.prenom && touched.prenom && <Form.Control.Feedback type="invalid">{errors.prenom}</Form.Control.Feedback>}
                            </Form.Group>

                            <Form.Group className="py-1">
                                <Form.Label htmlFor="email">Email:</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    id="email"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                    isInvalid={!!errors.email && touched.email}
                                />
                                {errors.email && touched.email && <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>}
                            </Form.Group>

                            <Form.Group className="py-1">
                                <Form.Label htmlFor="sexe">Sexe:</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="sexe"
                                    id="sexe"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.sexe}
                                    isInvalid={!!errors.sexe && touched.sexe}
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </Form.Control>
                                {errors.sexe && touched.sexe && <Form.Control.Feedback type="invalid">{errors.sexe}</Form.Control.Feedback>}
                            </Form.Group>

                            <Form.Group className="py-1">
                                <Form.Label htmlFor="password">Mot de passe:</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    id="password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    isInvalid={!!errors.password && touched.password}
                                />
                                {errors.password && touched.password && <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>}
                            </Form.Group>

                            <Form.Group className="py-1">
                                <Form.Label htmlFor="confirmPassword">Confirmation du mot de passe:</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.confirmPassword}
                                    isInvalid={!!errors.confirmPassword && touched.confirmPassword}
                                />
                                {errors.confirmPassword && touched.confirmPassword && <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>}
                            </Form.Group>

                            <SubmitButton disabled={isSubmitting} loading={isSubmitting} />
                            <p className="pt-4 text-secondary">Vous Avez Déja un compte <Link to="/login">Connection</Link></p>
                        </Form>
                    </div>
                </Row>
            </Container>
        </section>
    )
}

export default Register;
