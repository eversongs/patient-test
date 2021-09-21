import React from 'react';
import { Navigate, RouteObject, RouteProps, useRoutes } from 'react-router';
import './App.css';
import MainPage from './page/MainPage';

export const ROUTES: RouteObject[] = [
    {
        path: '/',
        element: <Navigate to="/app/main" />
    },
    {
        path: '/app/main',
        element: <MainPage />
    }
]

function App() {
    const routing = useRoutes(ROUTES);
    return (
        <>
            {routing}
        </>
    );
}

export default App;
