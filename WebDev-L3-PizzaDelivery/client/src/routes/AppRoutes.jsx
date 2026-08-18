import LandingPage from "../pages/public/LandingPage";
import SignupPage from './../pages/auth/Signup';
import LoginPage from './../pages/auth/Login';
import AboutPage from './../pages/public/AboutPage';

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
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "/signup",
        element: <SignupPage />
    }
]