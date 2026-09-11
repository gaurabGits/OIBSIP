import LandingPage from "../pages/public/LandingPage";
import AboutPage from "../pages/public/AboutPage";
import MenuPage from "../pages/public/MenuPage";

import SignupPage from "../pages/auth/Signup";
import LoginPage from "../pages/auth/Login";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";

import DashboardPage from "../pages/user/DashboardPage";

import ProtectedRoute from "./ProtectedRoute";

export const routes = [
  {
    path: "/",
    element: <LandingPage />,
  },

  {
    path: "/about",
    element: <AboutPage />,
  },

  {
    path: "/menu",
    element: <MenuPage />,
  },

  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/signup",
    element: <SignupPage />,
  },

  {
    path: "/login/forgot-password",
    element: <ForgotPasswordPage />,
  },

  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },

  {
    path: "/verify-email",
    element: <VerifyEmailPage />,
  },

  // Protected user routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
    ],
  },
];