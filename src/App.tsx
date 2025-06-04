import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Webinars from './pages/Webinars';
import WebinarDetail from './pages/WebinarDetail';
import Certificates from './pages/Certificates';
import AccreditationBodies from './pages/AccreditationBodies';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/webinars" element={<Webinars />} />
          <Route path="/webinars/:id" element={<WebinarDetail />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/accreditation" element={<AccreditationBodies />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
