import React from 'react';
import { Redirect } from 'react-router-dom';
import { getToken } from '../services/api';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const token = getToken();

  if (!token) return <Redirect to="/login" />;
  
  return <>{children}</>;
};

export default ProtectedRoute;
