'use client';

import { useContext } from 'react';
import { TenantContext } from '../contexts';

export function useTenant() {
  const context = useContext(TenantContext);

  if (!context) {
    throw new Error('This component should be used inside <TenantProvider> component.');
  }
  return context;
}
