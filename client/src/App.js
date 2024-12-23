import React, { useEffect, useState } from "react";
import './App.css';
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import ProfilePage from "./pages/ProfilePage";
import ClassesDetails from "./pages/ClassesDetails";
import { AuthProvider, useAuth } from "./context/AuthContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedRoute = ({ children }) => {
  const { auth, login } = useAuth();
  const [loading, setLoading] = useState(true); // Loading state while checking auth
  const navigate = useNavigate();


  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/checklogin`, {
          method: 'GET',
          credentials: 'include', // Include cookies for the auth token
        });
        const data = await response.json();

        if (response.ok && data.ok) {
          login({ userId: data.userId }); // Set user in context
          setLoading(false); // User is logged in, loading is done
        } else {
          toast.error(data.message || 'Session expired. Please log in again.');
          navigate('/login');
        }


      }
      catch (error) {
        toast.error('Error checking login status.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    }
    checkLoginStatus();

  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // You can add a spinner or loading indicator here
  }

  return auth.user ? children : <Navigate to="/login" />;
}

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Homepage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />

          <Route
            path="/classes/:classid"
            element={
              <ProtectedRoute>
                <ClassesDetails />
              </ProtectedRoute>
            } 
          />
          
        </Routes>
          <ToastContainer />
      </Router>
    </AuthProvider>
  );
};

export default App;
