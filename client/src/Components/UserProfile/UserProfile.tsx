import { useEffect, useLayoutEffect } from 'react'
import { Col, Form, Row } from 'react-bootstrap';
import SubmitButton from '../../SubComponents/SubmitButton/SubmitButton';
import { useFormik } from 'formik';
import { IUserProfile, userProfileSchema } from '../../Configuration/userProfileSchema';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

function UserProfile() {
    const SERVER: string = import.meta.env.VITE_SERVER as string;

    useLayoutEffect(() => {
        document.title = "Profile";
    }, []);

    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const res: AxiosResponse<any, any> = await axios.get(`${SERVER}/user/get-profile`, { withCredentials: true });
                if (res.data.success) {
                    console.log(res.data);
                    const profile = res.data.profile;
                    setValues({
                        nom: profile.nom,
                        prenom: profile.prenom,
                        sexe: profile.sexe,
                        email: profile.email,
                        password: "",
                    });
                }
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    toast.warning(error.response?.data.message);
                } else {
                    console.error(error);
                    toast.error(error?.message || "Ops An Error Happend while Fetching the Profile Data");
                }
            }
        }

        getUserProfile();
    }, []);

    const onSubmit = async (state: IUserProfile) => {
        try {
            const res: AxiosResponse<any, any> = await axios.put(`${SERVER}/user/update-profile`, state, { withCredentials: true });
            if (res.data.success) {
                toast.success("Compte Améliorer avec Succès");
            }
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data.message);
            } else {
                console.error(error);
                toast.error(error?.message || "Ops An Error Happend while Updating The Data");
            }
        }
    };

    const { values, touched, errors, isSubmitting, setValues, handleChange, handleBlur, handleSubmit } = useFormik({
        validationSchema: userProfileSchema,
        initialValues: {
            nom: "",
            prenom: "",
            sexe: "",
            email: "",
            password: "",
        },
        onSubmit,
    });

    return (
        <div className="min-vh-100 py-5 bg-light">
            <Row className="d-flex flex-row justify-content-center align-items-center">
                <Col xs={12} md={6} lg={4} >
                    <Form autoComplete="off" onSubmit={handleSubmit} className="py-5 px-4 mx-4 bg-white shadow rounded">
                        <h2 className="text-center pb-3" style={{ color: "var(--lightBlue)" }}>Profile</h2>
                        <Form.Group className="py-1">
                            <Form.Label htmlFor="nom">Nom: </Form.Label>
                            <Form.Control type="text" id="nom" name="nom" placeholder="Nom" value={values.nom} onChange={handleChange} onBlur={handleBlur} />
                            {errors.nom && touched.nom && <h3 className="text-danger fs-6">{errors.nom}</h3>}
                        </Form.Group>

                        <Form.Group className="py-1">
                            <Form.Label htmlFor="prenom">Prenom: </Form.Label>
                            <Form.Control type="text" id="prenom" name="prenom" placeholder="Prenom" onChange={handleChange} onBlur={handleBlur} value={values.prenom} />
                            {errors.prenom && touched.prenom && <h3 className="text-danger fs-6">{errors.prenom}</h3>}
                        </Form.Group>

                        <Form.Group className="py-1">
                            <Form.Label htmlFor="email">E-mail: </Form.Label>
                            <Form.Control type="text" placeholder="e-mail" name="email" id="email" onChange={handleChange} onBlur={handleBlur} value={values.email} />
                            {errors.email && touched.email && <h3 className="text-danger fs-6">{errors.email}</h3>}
                        </Form.Group>

                        <Form.Group className="py-1">
                            <Form.Label htmlFor="sexe">Sexe: </Form.Label>
                            <Form.Select defaultValue="" value={values.sexe} onChange={handleChange} onBlur={handleBlur} name="sexe" id="sexe">
                                <option value="" disabled>Sexe</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </Form.Select>
                            {errors.sexe && touched.sexe && <h3 className="text-danger fs-6">{errors.sexe}</h3>}
                        </Form.Group>

                        <Form.Group className="py-1">
                            <Form.Label htmlFor="password">Password: </Form.Label>
                            <Form.Control type="text" placeholder="Password" name="password" id="password" onChange={handleChange} onBlur={handleBlur} value={values.password} />
                            {errors.password && touched.password && <h3 className="text-danger fs-6">{errors.password}</h3>}
                        </Form.Group>

                        <SubmitButton loading={isSubmitting} disabled={isSubmitting} />
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default UserProfile;