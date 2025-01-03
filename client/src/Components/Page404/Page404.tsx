import { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

function Page404() {
    const navigate = useNavigate();

    const navigateToHome = () => {
        navigate("/");
    };

    useLayoutEffect(() => {
        document.title = "Page 404";
    }, []);

    return (
        <div style={{ paddingTop: "80px" }} className="bg-dark text-white min-vh-100 d-flex flex-column justify-content-start align-items-center">
            <h2 className="title text-center py-5">Page 404</h2>
            <div className="d-flex flex-column justify-content-center align-items-center">
                <p className="lead">Page Pas Trouvé</p>
                <button style={{ padding: "16px 24px", borderRadius: "8px" }} className="btn btn-info mt-3" type="button" onClick={navigateToHome}>Page Principale</button>
            </div>
        </div>
    );
}

export default Page404;
