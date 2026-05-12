import { createBrowserRouter } from 'react-router';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import Protected from './features/auth/components/Protected';
import Home from './features/interview/pages/Home';
import Interview from './features/interview/pages/Interview';
import Landing from './features/landing/pages/Landing';
import Profile from './features/profile/pages/Profile';
import Layout from './components/layout/Layout';


export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Landing />,
            },
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: '/register',
                element: <Register />,
            },
            {
                path: '/create-plan',
                element: <Protected><Home /></Protected>,
            },
            {
                path: '/interview/:interviewId',
                element: <Protected><Interview /></Protected>,
            },
            {
                path: '/profile',
                element: <Protected><Profile /></Protected>,
            },
        ],
    },
]);
