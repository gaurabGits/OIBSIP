import LandingPage from "../pages/public/LandingPage";
import SignupPage from './../pages/auth/Signup';
import LoginPage from './../pages/auth/Login';
import AboutPage from './../pages/public/AboutPage';
import MenuPage from './../pages/public/MenuPage';

export const routes = [
    {
        path: "/",
        element: <LandingPage />
    },
    {
        path: "/about",
        element: <AboutPage />
    },
    {
        path: "/menu",
        element: <MenuPage />
    },
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "/signup",
        element: <SignupPage />
    }
]