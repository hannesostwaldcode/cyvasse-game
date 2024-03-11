import { ReactNode } from 'react';
import {
    Navigate
  } from 'react-router-dom';
import { useAuth } from './provider/AuthProvider';
import { useModal } from '@/hooks/useModal';
  
export const ProtectedRoute = ({ children }: {children: ReactNode}) => {
    const { token } = useAuth();
    const {onOpen} = useModal()
  
    if (!token) {
        onOpen('logIn')
        return <Navigate to="/" replace />;
    }
  
    return children;
  };