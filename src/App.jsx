import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import RootRedirect from './components/auth/RootRedirect';
import RouteHandler from './components/auth/RouteHandler';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import History from './pages/History';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <RouteHandler>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
              <Navbar />

          <Routes>
            {/* Public routes - redirect to dashboard if already authenticated */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login key="login-page" />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register key="register-page" />
                </PublicRoute>
              }
            />

            {/* Protected routes - redirect to login if not authenticated */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />

            {/* Root redirect - smart redirect based on auth status */}
            <Route path="/" element={<RootRedirect />} />

            {/* Catch all route - redirect to login if not authenticated */}
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              }
            />
          </Routes>

          {/* Toast notifications */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          </div>
          </RouteHandler>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
