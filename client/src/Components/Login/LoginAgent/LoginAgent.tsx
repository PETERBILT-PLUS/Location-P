import { useFormik } from 'formik';
import React, { useLayoutEffect, useState } from 'react';
import { Container, Form, Row, Alert } from 'react-bootstrap';
import { LoginAgentSchema } from '../../../Configuration/Schema';
import { toast } from 'react-toastify';
import SubmitButton from '../../../SubComponents/SubmitButton/SubmitButton.tsx';
import './LoginAgent.css';
import { Link, useNavigate } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { loginAgency } from '../../../Configuration/agencySlice.ts';
import { logout } from '../../../Configuration/userSlice.ts';
import CookieConsent from "react-cookie-consent"; // Import the CookieConsent component

function LoginAgent() {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [cookieError, setCookieError] = useState<boolean>(false); // State to track cookie issues
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [state, setState] = useState<boolean>();
    const agency = useSelector((state: any) => state.auth.agency.currentAgency);
    const SERVER: string = import.meta.env.VITE_SERVER as string;

    useLayoutEffect(() => {
        document.title = 'Connexion (Agence)';
    }, []);

    const onSubmit = async (values: any, actions: any) => {
        try {
            setLoading(true);
            setCookieError(false); // Reset cookie error state

            const res: AxiosResponse<any, any> = await axios.post(`${SERVER}/agent/login`, values, { withCredentials: true });
            // Check if cookies are enabled
            if (!document.cookie.includes('token')) {
                setCookieError(true); // Notify user to enable cookies
                toast.warning('Les cookies ne sont pas activés. Veuillez les activer pour vous connecter.');
                return; // Stop further execution
            }


            if (res.data.success) {
                if (!agency) {
                    setState(true);
                }
                toast.success('Connexion réussie');
                dispatch(logout());
                dispatch(loginAgency(res.data.agency));
                actions.resetForm();

                if (state) {
                    navigate('/payment');
                } else {
                    navigate('/agence-dashboard');
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const { values, errors, touched, handleBlur, handleChange, handleSubmit, isSubmitting } = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: LoginAgentSchema,
        onSubmit,
    });

    return (
        <section className="login-agent py-5">
            <Container>
                <h3 className="text-light text-center title py-5">Connexion Agence</h3>
                <Row>
                    <div className="col-11 col-md-6 col-lg-4 mx-auto">
                        {/* Display a warning if cookies are not enabled */}
                        {cookieError && (
                            <Alert variant="warning" className="mb-4">
                                Les cookies ne sont pas activés dans votre navigateur. Veuillez activer les cookies pour vous connecter.{' '}
                                <a
                                    href="https://support.google.com/chrome/answer/95647"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Apprenez comment activer les cookies
                                </a>
                                .
                            </Alert>
                        )}
                        <Form className="agent-register-form" onSubmit={handleSubmit} autoComplete="off">
                            <Form.Label htmlFor="email" className="py-0">
                                E-mail :
                            </Form.Label>
                            <Form.Control
                                className="input-form mb-4 my-0"
                                type="email"
                                value={values.email}
                                isInvalid={!!errors.email && touched.email}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                placeholder="E-mail"
                                name="email"
                            />
                            {errors.email && touched.email && <h6 className="text-danger error-header">{errors.email}</h6>}
                            <Form.Label htmlFor="password">Mot de passe :</Form.Label>
                            <Form.Control
                                className="input-form my-0"
                                type="password"
                                value={values.password}
                                isInvalid={!!errors.password && touched.password}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                placeholder="Mot de passe"
                                name="password"
                            />
                            {errors.password && touched.password && (
                                <h6 className="text-danger error-header">{errors.password}</h6>
                            )}
                            <SubmitButton disabled={isSubmitting} loading={loading} />
                            <Form.Text id="passwordHelpBlock" muted>
                                <p className="pt-3">
                                    Vous n'avez pas de compte ? <Link to="/register-agent">Inscrivez-vous</Link>
                                </p>
                            </Form.Text>
                        </Form>
                    </div>
                </Row>
            </Container>

            {/* Cookie Consent Banner */}
            <CookieConsent
                location="bottom"
                buttonText="J'accepte"
                declineButtonText="Je refuse"
                cookieName="tokenCookie"
                style={{ background: '#2B373B' }}
                buttonStyle={{ background: '#4CAF50', color: '#fff', fontSize: '13px' }}
                declineButtonStyle={{ background: '#f44336', color: '#fff', fontSize: '13px' }}
                enableDeclineButton
                onAccept={() => {
                    toast.success('Les cookies sont activés. Vous pouvez maintenant vous connecter.');
                }}
                onDecline={() => {
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
    );
}

export default LoginAgent;