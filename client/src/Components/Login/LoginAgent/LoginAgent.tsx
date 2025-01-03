import { useFormik } from 'formik';
import React, { useLayoutEffect, useState } from 'react'
import { Container, Form, Row } from 'react-bootstrap';
import { LoginAgentSchema } from '../../../Configuration/Schema';
import { toast } from 'react-toastify';
import SubmitButton from '../../../SubComponents/SubmitButton/SubmitButton.tsx';
import "./LoginAgent.css";
import { Link, useNavigate } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { loginAgency } from '../../../Configuration/agencySlice.ts';
import { logout } from '../../../Configuration/userSlice.ts';


function LoginAgent() {
    const [loading, setLoading] = React.useState<boolean>(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [state, setState] = useState<boolean>();
    const agency = useSelector((state: any) => state.auth.agency.currentAgency);
    const SERVER: string = import.meta.env.VITE_SERVER as string;

    useLayoutEffect(() => {
        document.title = "Login (Agence)";
    }, []);

    const onSubmit = async (values: any, actions: any) => {
        try {
            setLoading(true);
            const res: AxiosResponse<any, any> = await axios.post(`${SERVER}/agent/login`, values, { withCredentials: true });
            if (res.data.success) {
                if (!agency) {
                    setState(true);
                }
                toast.success("Login Succès");
                dispatch(logout());
                dispatch(loginAgency(res.data.agency));
                actions.resetForm();
                if (state) {
                    navigate("/payment");
                } else {
                    navigate("/agence-dashboard");
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data.message);
            }
        } finally {
            setLoading(false);
        }
    }

    const { values, errors, touched, handleBlur, handleChange, handleSubmit, isSubmitting } = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: LoginAgentSchema,
        onSubmit,
    });
    return (
        <section className="login-agent py-5">
            <Container>
                <h3 className="text-light text-center title py-5">Login Agence</h3>
                <Row>
                    <div className="col-11 col-md-6 col-lg-4 mx-auto">
                        <Form className="agent-register-form" onSubmit={handleSubmit} autoComplete="off">
                            <Form.Label htmlFor="email" className="py-0">E-mail:</Form.Label>
                            <Form.Control className="input-form mb-4 my-0" type="email" value={values.email} isInvalid={!!errors.email && touched.email} onBlur={handleBlur} onChange={handleChange} placeholder="email" name="email" />
                            {errors.email && touched.email && <h6 className="text-danger error-header">{errors.email}</h6>}
                            <Form.Label htmlFor="password">Password:</Form.Label>
                            <Form.Control className="input-form my-0" type="password" value={values.password} isInvalid={!!errors.password && touched.password} onBlur={handleBlur} onChange={handleChange} placeholder="password" name="password" />
                            {errors.password && touched.password && <h6 className="text-danger error-header">{errors.password}</h6>}
                            <SubmitButton disabled={isSubmitting} loading={loading} />
                            <Form.Text id="passwordHelpBlock" muted>
                                <p className="pt-3">Vous navez pas du compte <Link to="/register-agent">Register</Link></p>
                            </Form.Text>
                        </Form>
                    </div>
                </Row>
            </Container>
        </section>
    )
}

export default LoginAgent;