'use client';

import { ReactNode, createContext, useEffect, useState } from 'react';
import { TenantConfig, tenantConfigs } from './tenantConfigs';


export type TenantContextState = {
  tenantConfig?: TenantConfig;
};

type TenantProviderProps = {
  children: ReactNode;
  isToMock?: boolean;
};

const defaultTenantContextState: TenantContextState = {
  tenantConfig: undefined,
};

export const TenantContext = createContext<TenantContextState>(defaultTenantContextState);

export function TenantProvider({ children }: TenantProviderProps) {
  const [contextValue, setContextValue] = useState<TenantContextState>(defaultTenantContextState);
  const [tenantError, setTenantError] = useState<string | null>(null);

  const getConfig = async () => {
    try {
      const clientDomain = window.location.host;
      // You can fetch this from your backend
      const tenantConfig = tenantConfigs[clientDomain]
      setContextValue({ tenantConfig });
    } catch (error) {
      setTenantError('This tenant is not well configured');
    }
  };

  useEffect(() => {
    getConfig();
  }, []);

  if (tenantError) {
    return (
      <div>
        <header>
          <h1>Error</h1>
        </header>

        <main>
          <span>{tenantError}</span>
        </main>
      </div>
    );
  }

  return <TenantContext.Provider value={contextValue}>{children}</TenantContext.Provider>;
}
