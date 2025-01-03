import axios, { AxiosResponse } from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function CheckUser() {
    const user = useSelector((state: any) => state.auth.user.currentUser);
    const SERVER: string = import.meta.env.VITE_SERVER as string;
    const navigate = useNavigate();


    useEffect(() => {
        const getUserCookie = async () => {
            try {
                const res: AxiosResponse<any> = await axios.get(`${SERVER}/user-state/get-state`, { withCredentials: true });
                if (res.data.succes) {
                    return true;
                }
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    if (user && error.response?.status == 403) {
                        navigate("/login");
                        toast.warning(error.response?.data.message);
                    }
                } else {
                    toast.error(error?.message);
                    console.error(error)
                }
            }
        }

        if (user) getUserCookie();
    }, []);
    return (
        <>
            {user ? (<Outlet />) : (<Navigate to="/login" />)}
        </>
    )
}

export default CheckUser;