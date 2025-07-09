import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useForceNavigation } from '../../hooks/useForceNavigation';

const RootRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const forceNavigate = useForceNavigation();

  useEffect(() => {
    if (!isLoading) {
      const targetPath = isAuthenticated ? '/dashboard' : '/login';
      forceNavigate(targetPath);
    }
  }, [isAuthenticated, isLoading, forceNavigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Fallback Navigate components
  return isAuthenticated ?
    <Navigate to="/dashboard" replace /> :
    <Navigate to="/login" replace />;
};

export default RootRedirect;
