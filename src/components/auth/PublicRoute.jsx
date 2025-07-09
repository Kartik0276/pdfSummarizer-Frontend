import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading, clearError } = useAuth();
  const location = useLocation();
  const [forceUpdate, setForceUpdate] = useState(0);

  // Listen for auth state changes
  useEffect(() => {
    const handleAuthChange = () => {
      setForceUpdate(prev => prev + 1);
    };

    window.addEventListener('auth-state-changed', handleAuthChange);
    return () => window.removeEventListener('auth-state-changed', handleAuthChange);
  }, []);

  // Clear any auth errors when navigating between public routes
  useEffect(() => {
    if (clearError) {
      clearError();
    }
  }, [location.pathname, clearError]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // If not authenticated, show the public page (login/register)
  return children;
};

export default PublicRoute;
