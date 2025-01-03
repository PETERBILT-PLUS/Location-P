import React from 'react';
import axios, { AxiosResponse } from 'axios';
import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

function CheckState() {
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.auth.user.currentUser);
    const agency = useSelector((state: any) => state.auth.agency.currentAgency);
    const SERVER: string = import.meta.env.VITE_SERVER as string;

    React.useEffect(() => {
        const getState = async () => {
            try {
                if (user) {
                    const res: AxiosResponse<any> = await axios.get(`${SERVER}/user-state/get-state`, { withCredentials: true });
                    if (res.data.success) {
                        return true;
                    }
                } else if (agency) {
                    const res: AxiosResponse<any> = await axios.get(`${SERVER}/agent-state/agent-subscription-state`, { withCredentials: true });
                    if (res.data.success) {
                        return true;
                    }
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (agency && error.response?.status === 403) {
                        toast.warning(error.response?.data.message);
                        navigate("/payment");
                    } else if (user && error.response?.status === 403) {
                        toast.warning(error.response?.data.message);
                        navigate("/login");
                    }
                }
            }
        }

        if (user || agency) {
            getState();
        }
    }, [user, agency]);

    return (
        <Outlet />
    );
}

export default CheckState;
