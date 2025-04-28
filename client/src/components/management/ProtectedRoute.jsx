import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from '@/services/authService';

// Add keyframes style for the spinner
const spinnerStyle = {
  animation: 'spin 1s linear infinite'
};

// Define the animation in a style block
const spinnerKeyframes = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication...');
        const response = await authService.checkAuth();
        console.log('Auth response:', response);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    const initialAuthState = authService.isAuthenticated();
    console.log('Initial auth state:', initialAuthState);
    
    if (initialAuthState) {
      checkAuth();
    } else {
      console.log('No token found, redirecting to login');
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, []);

  // Add the keyframes to the document
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = spinnerKeyframes;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  if (isLoading) {
    // Show loading spinner
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(0, 0, 0, 0.1)',
          borderTopColor: '#3498db',
          borderRadius: '50%',
          ...spinnerStyle
        }}></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/management/login" replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute; 