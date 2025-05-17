
import { createBrowserRouter } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import RoleSelection from "@/pages/RoleSelection";
import NotFound from "@/pages/NotFound";
import BeneficiarySignUp from "@/pages/BeneficiarySignUp";
import SponsorSignUp from "@/pages/SponsorSignUp";
import Logout from "@/pages/Logout";
import OAuthCallback from "@/pages/OAuthCallback";
import SwitchRole from "@/pages/SwitchRole";

// Beneficiary pages
import BeneficiaryLayout from "@/components/layout/BeneficiaryLayout";
import Dashboard from "@/pages/beneficiary/Dashboard";
import Requests from "@/pages/beneficiary/Requests";
import Sponsors from "@/pages/beneficiary/Sponsors";
import BillHistory from "@/pages/beneficiary/BillHistory";
import BeneficiaryBundleDetails from "@/pages/beneficiary/BeneficiaryBundleDetails";
import Settings from "@/pages/beneficiary/Settings";
import Web3Wallet from "@/pages/beneficiary/Web3Wallet";

// Sponsor pages
import SponsorLayout from "@/components/layout/SponsorLayout";
import SponsorDashboard from "@/pages/sponsor/Dashboard";
import IncomingRequests from "@/pages/sponsor/IncomingRequests";
import Beneficiaries from "@/pages/sponsor/Beneficiaries";
import BillsPaid from "@/pages/sponsor/BillsPaid";
import SponsorBundleDetails from "@/pages/sponsor/SponsorBundleDetails";
import SponsorSettings from "@/pages/sponsor/Settings";
import WalletAndToken from "@/pages/sponsor/WalletAndToken";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/role-selection",
    element: <RoleSelection />,
  },
  {
    path: "/signup/beneficiary",
    element: <BeneficiarySignUp />,
  },
  {
    path: "/signup/sponsor",
    element: <SponsorSignUp />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/oauth-callback",
    element: <OAuthCallback />,
  },
  {
    path: "/switch-role",
    element: <SwitchRole />,
  },
  
  // Beneficiary routes
  {
    path: "/beneficiary",
    element: <BeneficiaryLayout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "requests",
        element: <Requests />,
      },
      {
        path: "sponsors",
        element: <Sponsors />,
      },
      {
        path: "bill-history",
        element: <BillHistory />,
      },
      {
        path: "bundle/:bundleId",
        element: <BeneficiaryBundleDetails />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "wallet",
        element: <Web3Wallet />,
      },
    ],
  },
  
  // Sponsor routes
  {
    path: "/sponsor",
    element: <SponsorLayout />,
    children: [
      {
        path: "dashboard",
        element: <SponsorDashboard />,
      },
      {
        path: "requests",
        element: <IncomingRequests />,
      },
      {
        path: "beneficiaries",
        element: <Beneficiaries />,
      },
      {
        path: "bills",
        element: <BillsPaid />,
      },
      {
        path: "bundle/:bundleId",
        element: <SponsorBundleDetails />,
      },
      {
        path: "settings",
        element: <SponsorSettings />,
      },
      {
        path: "wallet",
        element: <WalletAndToken />,
      },
    ],
  },
  
  // 404 page
  {
    path: "*",
    element: <NotFound />,
  },
]);
