import LandingPage from "../pages/public/LandingPage";
import AboutPage from "../pages/public/AboutPage";
import MenuPage from "../pages/public/MenuPage";
import PizzaDetailsPage from "../pages/public/PizzaDetailsPage";
import CustomPizzaPage from "../pages/public/CustomPizzaPage";
import CartPage from "../pages/public/CartPage";
import CheckoutPage from "../pages/public/CheckoutPage";
import OrderPage from "../pages/public/OrderPage";

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
    path: "/pizza/:id",
    element: <PizzaDetailsPage />,
  },

  {
    path: "/custom-pizza",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <CustomPizzaPage />,
      },
    ],
  },

  {
    path: "/cart",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <CartPage />,
      },
    ],
  },

  {
    path: "/checkout",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <CheckoutPage />,
      },
    ],
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
        path: "/profile",
        element: <DashboardPage />,
      },
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/orders",
        element: <OrderPage />,
      },
    ],
  },
];