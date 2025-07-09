import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RouteHandler = ({ children }) => {
  const location = useLocation();
  const { clearError } = useAuth();

  useEffect(() => {
    // Clear any auth errors when route changes
    if (clearError) {
      clearError();
    }
    
    // Force a small delay to ensure state updates are processed
    const timer = setTimeout(() => {
      // This helps ensure the component re-renders properly
      window.dispatchEvent(new Event('routechange'));
    }, 0);

    return () => clearTimeout(timer);
  }, [location.pathname, clearError]);

  return children;
};

export default RouteHandler;
