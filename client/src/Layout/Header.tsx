import React from 'react';
import { Button, Container, Modal, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleUp } from "@fortawesome/free-regular-svg-icons";
import { Link, useNavigate } from 'react-router-dom';
import CustomNavLink from './CustomNavLink.tsx';
import "./LayoutCss/Layout.css";
import LOGO from "../assets/VRentAuto.png";
import { useDispatch, useSelector } from 'react-redux';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { logoutAgency } from '../Configuration/agencySlice';
import { logout } from '../Configuration/userSlice';

function Header() {
    const [isVisible, setIsVisible] = React.useState<boolean>(false);
    const [showModal, setShowModal] = React.useState<boolean>(false);
    const [showLoginModal, setShowLoginModal] = React.useState<boolean>(false);
    const navigate = useNavigate();
    const authUser = useSelector((state: any) => state.auth.user.currentUser);
    const authAgency = useSelector((state: any) => state.auth.agency.currentAgency);
    const SERVER: string = import.meta.env.VITE_SERVER as string;
    const dispatch = useDispatch();

    React.useEffect(() => {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        });
    }, []);

    const scrollTopFn = () => {
        window.scrollTo(0, 0);
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleAccountType = (type: string) => {
        if (type === "agency") {
            navigate("/register-agent");
        } else {
            navigate("/register");
        }
        setShowModal(false);
    };

    const handleLoginType = (type: string) => {
        if (type === "agency") {
            navigate("/login-agent");
        } else {
            navigate("/login");
        }
        setShowLoginModal(false);
    };

    const handleShowLoginModal = () => setShowLoginModal(true);
    const handleCloseLoginModal = () => setShowLoginModal(false);

    const handleLogout = async () => {
        try {
            const res: AxiosResponse<any, any> = await axios.post(`${SERVER}/auth/logout`, null, { withCredentials: true });
            if (res.data.success) {
                toast.success("Déconnexion réussie");
                if (authAgency) {
                    dispatch(logoutAgency());
                    navigate("/login-agent");
                } else if (authUser) {
                    dispatch(logout());
                    navigate("/login");
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data.message);
            } else {
                console.error(error);
                toast.error("Une erreur est survenue");
            }
        }
    };

    return (
        <header className="header">
            <Navbar collapseOnSelect expand="lg" className="bg-white py-3" variant="light">
                <Container>
                    <button className="scroll-top-btn" style={{ visibility: isVisible ? "visible" : "hidden" }} onClick={scrollTopFn}>
                        <FontAwesomeIcon icon={faArrowAltCircleUp} className="btn-scrollTop" />
                    </button>
                    <Navbar.Brand><Link to="/"><img src={LOGO} alt="LOGO" style={{ height: "85px", width: "85px", borderRadius: "10px" }} /></Link></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="m-auto">
                            <Nav.Link as={Link} to="/">
                                <CustomNavLink to="/" className={({ isActive }) => (isActive ? "link-item-active" : "link-item")}>
                                    Acceuil
                                </CustomNavLink>
                            </Nav.Link>
                            <Nav.Link as={Link} to="/a-propos">
                                <CustomNavLink to="/a-propos" className={({ isActive }) => (isActive ? "link-item-active" : "link-item")}>
                                    A-Propos
                                </CustomNavLink>
                            </Nav.Link>
                            <Nav.Link as={Link} to="/politique-confidentialite">
                                <CustomNavLink to="/politique-confidentialite" className={({ isActive }) => (isActive ? "link-item-active" : "link-item")}>
                                    Politique-Confidentialite
                                </CustomNavLink>
                            </Nav.Link>
                            <Nav.Link as={Link} to="/conditions-generales">
                                <CustomNavLink to="/conditions-generales" className={({ isActive }) => (isActive ? "link-item-active" : "link-item")}>
                                    Conditions-Generales
                                </CustomNavLink>
                            </Nav.Link>
                        </Nav>
                        <Nav className="gap-4 flex flex-row align-items-center">
                            {authUser ? (
                                <>
                                    <NavDropdown title="Mon Compte" id="collapsible-nav-dropdown">
                                        <NavDropdown.Item as={Link} to="/mes-reservations">Mes Réservations</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/profile">Profil</NavDropdown.Item>
                                    </NavDropdown>
                                    <button type="button" className="create-account-btn" onClick={handleLogout}>Déconnecter</button>
                                </>
                            ) : (
                                <>
                                    <button type="button" style={{ border: "none", background: "transparent" }} onClick={handleShowLoginModal}>
                                        <Nav.Link className="text-center align-self-center">Log In</Nav.Link>
                                    </button>
                                    <button type="button" className="create-account-btn" onClick={handleShowModal}>Crée Un Compte</button>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Modal for Account Creation */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Créer un compte</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Voulez-vous créer un compte en tant qu'utilisateur ou agence ?</p>
                    <Button variant="primary" onClick={() => handleAccountType('normal')}>Utilisateur</Button>{' '}
                    <Button variant="primary" onClick={() => handleAccountType('agency')}>Agence</Button>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Annuler</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for Login */}
            <Modal show={showLoginModal} onHide={handleCloseLoginModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Se connecter</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Voulez-vous vous connecter en tant qu'utilisateur ou agence ?</p>
                    <Button variant="primary" onClick={() => handleLoginType('normal')}>Utilisateur</Button>{' '}
                    <Button variant="primary" onClick={() => handleLoginType('agency')}>Agence</Button>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseLoginModal}>Annuler</Button>
                </Modal.Footer>
            </Modal>
        </header>
    );
}

export default Header;
