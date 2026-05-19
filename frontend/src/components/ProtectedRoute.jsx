import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="container animate-fade-in">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && user.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
