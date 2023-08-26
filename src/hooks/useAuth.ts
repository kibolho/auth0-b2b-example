'use client';

import { useContext } from 'react';
import { AuthContext } from '../contexts';

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('This component should be used inside <AuthProvider> component.');
  }

  return context;
}
