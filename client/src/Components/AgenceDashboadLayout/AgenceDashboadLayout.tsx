import { Button, Container, Nav, NavDropdown, Navbar, Row } from 'react-bootstrap';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import AdminAgenceSideBar from '../AdminAgenceSideBar/AdminAgenceSideBar';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAgency } from '../../Configuration/agencySlice';
import { useEffect } from 'react';

function AgenceDashboadLayout() {

  const SERVER: string = import.meta.env.VITE_SERVER as string;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const agent = useSelector((state: any) => state.auth.agency.currentAgency);


  const handleLogout = async () => {
    try {
      const res: AxiosResponse<any, any> = await axios.post(`${SERVER}/agent/logout`, null, { withCredentials: true });
      if (res.data.success) {
        toast.success("Déconnecion Succès");
        dispatch(logoutAgency());
        navigate("/");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        toast.warning(error.response?.data.message);
      } else {
        console.error(error);
        toast.error(error?.message || "Failed Request Logout");
      }
    }
  }

  useEffect(() => {
    const getCookieState = async () => {
      try {
        const res: AxiosResponse<any> = await axios.get(`${SERVER}/agent-state/get-cookie-state`, { withCredentials: true });
        if (res.data.success) {
          return true;
        }
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status == 403) {
            navigate("/login-agent");
            toast.warning(error.response?.data.message);
          }
        } else {
          toast.error(error.message);
          console.error(error);
        }
      }
    }

    if (agent) getCookieState();
  }, []);

  return (
    <section className="container-fluid bg-light min-vh-100">
      <Row>
        <div className="d-none d-lg-block col-lg-2 px-0">
          <AdminAgenceSideBar />
        </div>
        <div className="col-12 col-lg-10 px-0 py-0" style={{ height: "100vh", overflowY: "scroll" }}>
          <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
            <Container>
              <Link to="/agence-dashboard"><Navbar.Brand>Bonjour {agent.nom} {agent.prenom}</Navbar.Brand></Link>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  <NavDropdown title="Plus" id="collapsible-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/agence-dashboard" style={{ textDecoration: "none" }}>
                      Dashboard
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/agence-dashboard/profile" style={{ textDecoration: "none" }}>
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/agence-dashboard/create-listing" style={{ textDecoration: "none" }}>
                      Ajouter Un Vehicule
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/agence-dashboard/vehicules" style={{ textDecoration: "none" }}>
                      Mes Vehicules
                    </NavDropdown.Item>
                    {/*<NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">
                      Separated link
                    </NavDropdown.Item>*/}
                  </NavDropdown>
                </Nav>
                <Nav className="">
                  <Button variant="outline-light" style={{ width: "125px" }} onClick={handleLogout}>Déconnexion</Button> {/* Logout button */}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <Outlet />
        </div>
      </Row>
    </section>
  )
}

export default AgenceDashboadLayout;