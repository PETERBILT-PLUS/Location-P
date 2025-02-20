import { Col, Row, Spinner } from 'react-bootstrap';
import { NavLink, Outlet } from 'react-router-dom';
import "./SuperAdminLayout.css";
import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

function SuperAdminLayout() {
    const [loading, setLoading] = useState<boolean>(true);
    const SERVER: string = import.meta.env.VITE_SERVER as string;
    const token: string | undefined = localStorage.getItem("token") || undefined;

    useEffect(() => {
        const getSuperAdminState = async () => {
            try {
                const res: AxiosResponse<{ success: boolean, isAdmin: boolean, message?: string }> = await axios.get(`${SERVER}/super-admin-state/state`, { withCredentials: true, params: { token: token } });
                if (res.data.success && res.data.isAdmin) {
                    toast.info("Bienvenue");
                }
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    toast.warning(error.response?.data.message);
                } else {
                    console.error(error);
                    toast.error(error?.message);
                }
            } finally {
                setLoading(false);
            }
        };

        getSuperAdminState();
    }, []);

    if (loading) {
        return (
            <div className="min-vh-100 bg-light d-flex flex-row justify-content-center align-items-center">
                <Spinner></Spinner>
            </div>
        );
    }

    return (
        <div className="bg-light" style={{ height: "100vh", overflow: "hidden" }}>
            <Row className="w-100 h-100 mx-auto">
                <Col xs={0} md={3} style={{ overflowY: 'hidden' }} className="px-0 sidebar d-none d-md-flex flex-column justify-content-start align-items-center">
                    <h1 className="mx-auto py-5 text-white">Super Admin</h1>

                    <div className="w-100 d-flex flex-column">
                        <NavLink to="/super-admin/" end className={({ isActive }) => isActive ? "link active w-100 py-3 px-5 text-start" : `link w-100 py-3 px-5 text-start`}>Dashboard</NavLink>
                        <NavLink to="/super-admin/utilisateurs" className={({ isActive }) => isActive ? "link active w-100 py-3 px-5 text-start" : `link w-100 py-3 px-5 text-start`}>Utilisateurs</NavLink>
                        <NavLink to="/super-admin/reservations" className={({ isActive }) => isActive ? "link active w-100 py-3 px-5 text-start" : `link w-100 py-3 px-5 text-start`}>Réservations</NavLink>
                        <NavLink to="/super-admin/agences" className={({ isActive }) => isActive ? "link active w-100 py-3 px-5 text-start" : `link w-100 py-3 px-5 text-start`}>Agences</NavLink>
                        <NavLink to="/super-admin/analytics" className={({ isActive }) => isActive ? "link active w-100 py-3 px-5 text-start" : `link w-100 py-3 px-5 text-start`}>Analytics</NavLink>
                    </div>
                </Col>

                <Col xs={12} md={9} style={{ overflowY: "scroll" }}>
                    <Outlet />
                </Col>
            </Row>
        </div>
    );
}

export default SuperAdminLayout;
