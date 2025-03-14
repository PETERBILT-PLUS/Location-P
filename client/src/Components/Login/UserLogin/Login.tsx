import { FormikHelpers, useFormik } from 'formik';
import { Container, Form, Row } from 'react-bootstrap';
import * as yup from 'yup';
import SubmitButton from '../../../SubComponents/SubmitButton/SubmitButton';
import "./Login.css";
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../Configuration/userSlice';
import { useState } from 'react';
import CookieConsent from 'react-cookie-consent'; // Import the CookieConsent component
import { Helmet } from 'react-helmet-async';

// Validation schema for login
const loginSchema = yup.object().shape({
    email: yup.string().email('Email invalide').required('Email est requis'),
    password: yup.string().required('Mot de passe est requis'),
});

interface ILogin {
    email: string;
    password: string;
}

function Login() {
    const SERVER: string = import.meta.env.VITE_SERVER as string;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [cookieError, setCookieError] = useState<boolean>(false); // State to track cookie issues
    const [cookiesEnabled, setCookiesEnabled] = useState<boolean>(false); // State to track user's cookie consent

    const onSubmit = async (values: ILogin, actions: FormikHelpers<ILogin>) => {
        try {
            setCookieError(false); // Reset cookie error state

            const res: AxiosResponse<any> = await axios.post(`${SERVER}/auth/login`, values, {
                withCredentials: true, // Ensure cookies are sent with the request
            });

            if (res.data.success || cookiesEnabled) {
                // Store the token based on the user's cookie consent
                toast.success('Connexion réussie');
                // Cookies are not enabled, so store the token in localStorage
                localStorage.setItem('token', res.data.token);
                setCookieError(true); // Notify user to enable cookies
                toast.warning('Les cookies ne sont pas activés. Le jeton a été stocké dans le localStorage.');
                if (res.data.superAdmin) {
                    // Super Admin Login
                    toast.success("Connexion Super Admin réussie");
                    actions.resetForm();
                    navigate("/super-admin");
                } else {
                    // Regular User Login
                    toast.success("Utilisateur connecté avec succès");
                    actions.resetForm();
                    dispatch(loginUser(res.data.user));
                    await new Promise((resolve) => setTimeout(resolve, 3500));
                    navigate("/");
                }
            }
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data.message);
            } else {
                console.error(error);
                toast.error("Une erreur est survenue");
            }
        }
    };

    const { errors, touched, values, isSubmitting, handleSubmit, handleChange, handleBlur } = useFormik<ILogin>({
        validationSchema: loginSchema,
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit,
    });

    return (
        <>
            <Helmet>
                <title>Connexion - V Rent Auto Maroc</title>
                <meta name="description" content="Connectez-vous à votre compte V Rent Auto Maroc pour accéder à des offres exclusives de location de voitures au Maroc. Gérez vos réservations et trouvez la voiture idéale." />
                <link rel="canonical" href="https://www.vrentauto.com/login" />
            </Helmet>

            <section className="min-vh-100 py-5 bg-white login">
                <Container>
                    <h3 className="text-center text-white title py-5">Connexion</h3>
                    <Row>
                        <div className="col-11 col-md-6 col-lg-4 mx-auto">
                            {/* Display a warning if cookies are not enabled */}
                            {cookieError && (
                                <div className="alert alert-warning mb-4">
                                    Les cookies ne sont pas activés dans votre navigateur. Le jeton a été stocké dans le localStorage.{' '}
                                    <a
                                        href="https://support.google.com/chrome/answer/95647"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Apprenez comment activer les cookies
                                    </a>
                                    .
                                </div>
                            )}
                            <Form onSubmit={handleSubmit} className="agent-register-form">
                                <Form.Group className="py-2">
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

                                <Form.Group>
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

                                <SubmitButton loading={isSubmitting} disabled={isSubmitting} />
                                <p className="text-secondary pt-4">Vous Avez pas De compte <Link to="/register">Crée un compte</Link></p>
                            </Form>
                        </div>
                    </Row>
                </Container>

                {/* Cookie Consent Banner */}
                <CookieConsent
                    location="bottom"
                    buttonText="J'accepte"
                    declineButtonText="Je refuse"
                    cookieName="userConsent"
                    style={{ background: '#2B373B' }}
                    buttonStyle={{ background: '#4CAF50', color: '#fff', fontSize: '13px' }}
                    declineButtonStyle={{ background: '#f44336', color: '#fff', fontSize: '13px' }}
                    enableDeclineButton
                    expires={1}
                    onAccept={() => {
                        setCookiesEnabled(true); // User accepted cookies
                        toast.success('Les cookies sont activés. Vous pouvez maintenant vous connecter.');
                    }}
                    onDecline={() => {
                        setCookiesEnabled(false); // User declined cookies
                        toast.warning('Les cookies sont désactivés. Veuillez les activer pour utiliser cette application.');
                    }}
                >
                    Ce site utilise des cookies pour améliorer l'expérience utilisateur. En continuant à naviguer, vous acceptez notre utilisation des cookies.{' '}
                    <a
                        href="/politique-de-cookies"
                        style={{ color: '#4CAF50' }}
                    >
                        En savoir plus
                    </a>
                </CookieConsent>
            </section>
        </>
    );
}

export default Login;