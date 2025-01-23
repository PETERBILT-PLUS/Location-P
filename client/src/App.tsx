import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Layout from "./Layout/Layout.tsx";
import Home from "./Components/Home/Home.tsx";
import RegisterAgent from "./Components/Register/RegisterAgent/RegisterAgent.tsx";
import "./App.css";
import Payment from './Components/PaymentPage/Payment.tsx';
import LoginAgent from './Components/Login/LoginAgent/LoginAgent.tsx';
import AgenceDashboadLayout from './Components/AgenceDashboadLayout/AgenceDashboadLayout.tsx';
import AdminDashboard from './Components/AgentDashboard/AdminDashboard.tsx';
import AgenceAdminProfile from './Components/AgenceAdminProfile/AgenceAdminProfile.tsx';
import AgenceAdminVehicules from './Components/AgenceAdminVehicules/AgenceAdminVehicules.tsx';
import CheckState from './Components/checkState/CheckState.tsx';
import CreateListing from './Components/CreateListing/CreateListing.tsx';
import EditVehicule from './Components/EditVehicule/EditVehicule.tsx';
import SingleCar from './Components/SingleCar/SingleCar.tsx';
import Register from './Components/Register/Register/Register.tsx';
import Login from './Components/Login/UserLogin/Login.tsx';
import UserReservations from './Components/UserReservations/UserReservations.tsx';
import UserProfile from './Components/UserProfile/UserProfile.tsx';
import PaymentConfirm from "./Components/Payment/Payment.tsx";
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import CheckAgent from './Components/CheckAgent/CheckAgent.tsx';
import CheckUser from './Components/CheckUser/CheckUser.tsx';
import AgencyNotifications from './Components/AgencyNotifications/AgencyNotifications.tsx';
import AgencyReservations from './Components/AgencyReservations/AgencyReservations.tsx';
import Apropos from './Components/Apropos/Apropos.tsx';
import PolitiqueConfidentialite from './Components/PolitiqueConfidentialite/PolitiqueConfidentialite.tsx';
import ConditionsGenerales from './Components/ConditionsGenerales/ConditionsGenerales.tsx';
import SuperAdminLayout from './Layout/SuperAdminLayout/SuperAdminLayout.tsx';
import SuperAdminUsers from './Components/SuperAdminUsers/SuperAdminUsers.tsx';
import SuperAdminUserReservations from './Components/SuperAdminUserReservations/SuperAdminUserReservations.tsx';
import SuperAdminAgencys from './Components/SuperAdminAgencys/SuperAdminAgencys.tsx';
import SuperAdminDashboard from './Components/SuperAdminDashboard/SuperAdminDashboard.tsx';
import SuperAdminReservations from './Components/SuperAdminReservations/SuperAdminReservations.tsx';
import SuperAdminAnalytics from "./Components/SuperAdminAnalytics/SuperAdminAnalytics.tsx";
import Page404 from './Components/Page404/Page404.tsx';


function App() {
  const initialOptions = {
    clientId: "AUhXr6owudUIJNmKjtEUvncWpcbnscL5Xrw1oj0ex8PUavA1sQcIc7QES-SJmX0eQkCtCrTvffptTk1I",
    currency: "USD",
    intent: "capture",
  };

  const router = createBrowserRouter(createRoutesFromElements(
    <Route element={<CheckState />}>
      <Route path="*" element={<Page404 />} />

      <Route path="/super-admin" element={<SuperAdminLayout />}>
        <Route index element={<SuperAdminDashboard />}></Route>
        <Route path="utilisateurs" element={<SuperAdminUsers />}></Route>
        <Route path="get-user-reservations/:id" element={<SuperAdminUserReservations />}></Route>
        <Route path="agences" element={<SuperAdminAgencys />}></Route>
        <Route path="reservations" element={<SuperAdminReservations />}></Route>
        <Route path="analytics" element={<SuperAdminAnalytics />}></Route>
      </Route>

      {/* For the Agency Admin Routes*/}
      <Route path="/agence-dashboard" element={<AgenceDashboadLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="profile" element={<AgenceAdminProfile />}></Route>
        <Route path="vehicules" element={<AgenceAdminVehicules />}></Route>
        <Route path="create-listing" element={<CreateListing />}></Route>
        <Route path="edit-vehicule/:id" element={<EditVehicule />}></Route>
        <Route path="notifications" element={<AgencyNotifications />}></Route>
        <Route path="reservations" element={<AgencyReservations />}></Route>
      </Route>

      {/* For the user routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />}></Route>
        <Route path="register-agent" element={<RegisterAgent />}></Route>
        <Route path="login-agent" element={<LoginAgent />}></Route>
        <Route path="register" element={<Register />}></Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="a-propos" element={<Apropos />}></Route>
        <Route path="politique-confidentialite" element={<PolitiqueConfidentialite />}></Route>
        <Route path="conditions-generales" element={<ConditionsGenerales />}></Route>

        <Route element={<CheckUser />}>
          <Route path="mes-reservations" element={<UserReservations />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="cars/:id" element={<SingleCar />}></Route>
        </Route>

        <Route element={<CheckAgent />}>
          <Route path="payment" element={<Payment />}></Route>
          <Route path="confirm-payment" element={<PaymentConfirm />}></Route>
        </Route>
      </Route>
    </Route>
  ));
  return (
    <>
      <PayPalScriptProvider options={initialOptions}>
        <RouterProvider router={router} />
      </PayPalScriptProvider>
    </>
  )
}

export default App;