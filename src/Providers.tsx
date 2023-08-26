'use client';

import React, { PropsWithChildren } from "react";
import { AuthProvider, TenantProvider } from "./contexts";

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <TenantProvider>
      <AuthProvider authenticatedEntryPath="/profile">
        {children}
      </AuthProvider>
    </TenantProvider>
  );
}