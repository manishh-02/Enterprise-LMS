import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // Agar token nahi hai, toh seedha login par bhej do
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Agar role allowed nahi hai, toh access denied
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" />; // Ya unauthorized page par bhej sakte ho
  }

  return children;
};

export default PrivateRoute;