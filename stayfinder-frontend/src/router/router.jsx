import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../layouts/AppLayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";

import Home from "../pages/Home.jsx";
import Profile from "../pages/Profile.jsx";
import MyListings from "../pages/MyListings.jsx";
import ListingDetails from "../pages/ListingDetails.jsx";
import CreateListing from "../pages/CreateListing.jsx";
import NotFound from "../pages/NotFound.jsx";
import EditListing from "../pages/EditListings.jsx";

import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import ResetPassword from "../pages/ResetPassword.jsx";
import VerifyEmail from "../pages/VerifyEmail.jsx";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/my-listings",
        element: <MyListings />,
      },
      {
        path: "/create-listing",
        element: <CreateListing />,
      },
      {
        path: "/listing/:id",
        element: <ListingDetails />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
      {
        path: "/edit-listing/:id",
        element: <EditListing />,
      },
    ],
  },

  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password/:token",
        element: <ResetPassword />,
      },
      {
        path: "/verify-email/:token",
        element: <VerifyEmail />,
      },
    ],
  },
]);

export default router;
