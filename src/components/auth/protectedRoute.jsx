import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// This is a temporary auth check for development purposes
const isAuthenticated = () => {
  // In development, always return true to test protected routes
  // In production, you'd check for an actual auth token or session
  return true; // Force to true for testing
};

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  
  // If authenticated, show the protected content
  return children;
};

export default ProtectedRoute;
