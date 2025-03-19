import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const PrivateRoute = ({ children }) => {
    const { user } = useApp();

    // If the user is not logged in, redirect to login page
    return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
