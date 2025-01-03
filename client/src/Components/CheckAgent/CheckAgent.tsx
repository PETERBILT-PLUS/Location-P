import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

function CheckAgent() {
    const agent = useSelector((state: any) => state.auth.agency.currentAgency);
    return (
        <>
            {agent ? (<Outlet />) : (<Navigate to="/login-agent" />)}
        </>
    )
}

export default CheckAgent;