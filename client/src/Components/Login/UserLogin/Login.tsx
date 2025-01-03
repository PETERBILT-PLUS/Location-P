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
import { useLayoutEffect } from 'react';

// تعريف التحقق من صحة البيانات لنموذج تسجيل الدخول
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

    useLayoutEffect(() => {
        document.title = "Login (Utilisateur)";
    }, []);

    const onSubmit = async (values: ILogin, actions: FormikHelpers<ILogin>) => {
        try {
            const res: AxiosResponse<any, any> = await axios.post(`${SERVER}/auth/login`, values, { withCredentials: true });
            console.log(res.data);
            
            if (res.data.success) {
                if (res.data.superAdmin) {
                    // Super Admin Login
                    toast.success("Connexion Super Admin réussie");
                    actions.resetForm();
                    await new Promise((resolve) => setTimeout(resolve, 3500));
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
        <section className="min-vh-100 py-5 bg-white login">
            <Container>
                <h3 className="text-center text-white title py-5">Connexion</h3>
                <Row>
                    <div className="col-11 col-md-6 col-lg-4 mx-auto">
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
        </section>
    );
}

export default Login;
