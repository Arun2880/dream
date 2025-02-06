import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";


const AuthProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null until we check auth
  const location = useLocation(); // Get current location for redirect

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("https://crm.dreambytesolution.com/dream/checkauth", {
          withCredentials: true,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        });

        if (response.data.success) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error during authentication check:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    // Wait until we know if the user is authenticated
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // If not authenticated, redirect to login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the children (the protected route)
  return children;
};

export default AuthProtectedRoute;
