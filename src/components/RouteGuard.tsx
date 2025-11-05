import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedUserTypes: string[];
  redirectTo?: string;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  allowedUserTypes, 
  redirectTo = '/dashboard' 
}) => {
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userType = userData.userType;

  // If user is not logged in, redirect to home page where they can use the login modal
  if (!userData.id) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If user type is not allowed, redirect to dashboard
  if (!allowedUserTypes.includes(userType)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default RouteGuard;
