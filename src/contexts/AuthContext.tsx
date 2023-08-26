'use client';

import {
  AppState,
  Auth0Provider,
  Auth0ProviderOptions,
  User as Auth0User,
  AuthorizationParams,
  useAuth0,
} from '@auth0/auth0-react';
import * as jwtDecode from 'jwt-decode';
import { ReactNode, createContext, useCallback, useEffect, useState } from 'react';
import { useTenant } from '../hooks';

type User = {
  email: string;
  name?: string;
  picture?: string;
};
type TokenCollection = {
  access_token: string;
  id_token: string;
};

type TokenMetadata = {
  organizationName: string;
};

export type AuthContextState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  user?: User;
  error?: Error;
  login: () => void;
  logout: () => void;
  tokenMetadata?: TokenMetadata
  isInvitation: boolean
};

export type AuthProviderProps = {
  children: ReactNode;
  clientId?: string;
  unAuthenticatedEntryPath?: string;
  authenticatedEntryPath?: string;
  onLoginSuccess?: (params: {
    email: string;
    avatar: string;
    userName: string;
    accessToken: string;
  }) => void;
  onLogoutSuccess?: () => void;
  setCookieForCurrentDomain?: boolean;
};

const defaultAuthContextState: AuthContextState = {
  isLoading: false,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  isInvitation: false,
};

export const AuthContext = createContext<AuthContextState>(defaultAuthContextState);

const auth0ClientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '';
const auth0Domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN || '';
const auth0Audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE;
const auth0Namespace = process.env.NEXT_PUBLIC_AUTH0_NAMESPACE
const auth0CookieDomain =
  process.env.NEXT_PUBLIC_AUTH0_COOKIE_DOMAIN


function InnerAuthProvider({ children, ...props }: AuthProviderProps) {
  const {
    error,
    getAccessTokenSilently,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    user: userFromAuth0,
  } = useAuth0<User & Auth0User>();

  const { tenantConfig } = useTenant();

  const [authError, setAuthError] = useState<string | null>(null);
  const [user, setUser] = useState<User>();
  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata>();

  const {
    authenticatedEntryPath,
    onLoginSuccess,
    onLogoutSuccess,
    unAuthenticatedEntryPath = "",
  } = props;
  const url = typeof window !== 'undefined' ? window.location.origin : '';
  const baseRedirectUrl =  url;

  const urlSearchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : undefined;
  const organization = urlSearchParams?.get('organization') || undefined;
  const invitation = urlSearchParams?.get('invitation') || undefined;

  const handleLogin = async () => {
    const authorizationParams: AuthorizationParams = {
      redirect_uri: baseRedirectUrl + authenticatedEntryPath,
      organization: organization || tenantConfig?.auth0_organization_id,
      invitation,
    };

    loginWithRedirect({ authorizationParams });
  };

  const handleLogout = useCallback(async () => {
    logout({
      logoutParams: {
        returnTo: baseRedirectUrl + unAuthenticatedEntryPath,
      },
    });

    onLogoutSuccess?.();
  }, [baseRedirectUrl, logout, onLogoutSuccess, unAuthenticatedEntryPath]);

  const handleGetTokens = useCallback(async (): Promise<TokenCollection> => {
    const tokens = await getAccessTokenSilently({
        detailedResponse: true,
        authorizationParams: {
          scope: 'openid profile',
          audience: auth0Audience,
          redirect_uri: baseRedirectUrl + authenticatedEntryPath,
          organization: tenantConfig?.auth0_organization_id,
        },
      });
  
    if (!tokens.access_token) {
      throw new Error('No tokens found');
    }
    return tokens;
  }, [getAccessTokenSilently, baseRedirectUrl, authenticatedEntryPath, tenantConfig?.auth0_organization_id]);

  const setAccessToken = useCallback(async () => {
    try {
      const { access_token, id_token } = await handleGetTokens();

      const decodedIdToken = jwtDecode.default<any>(id_token);
      const payloadKey = `${auth0Namespace}/organization`;
      const organizationUrl = decodedIdToken[payloadKey]?.tenant_url || '';
      const organizationName = decodedIdToken[payloadKey]?.tenant_name || '';
      setTokenMetadata({organizationName})
      if (userFromAuth0)
        setUser({
          email: userFromAuth0.email,
          name: userFromAuth0.name,
          picture: userFromAuth0.picture,
        });

      if (access_token) {
        onLoginSuccess?.({
          email: userFromAuth0?.email || '',
          avatar: userFromAuth0?.picture || '',
          userName: userFromAuth0?.sub || '',
          accessToken: access_token,
        });
        if (
          organizationUrl &&
          organizationUrl !== url
        ) {
          const url = organizationUrl + authenticatedEntryPath;
          window.location.replace(url);
        }
      }
    } catch (error) {
      setAuthError('Authentication Error. Please contact support.');
    }
  }, [handleGetTokens, userFromAuth0, onLoginSuccess, url, authenticatedEntryPath]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setAuthError(null);
      setAccessToken();
    }
  }, [setAccessToken, isAuthenticated, isLoading]);
  if (authError) {
    return (
      <div>
        <header>
          <h1>Error</h1>
        </header>

        <main>
          <span>{authError}</span>
        </main>
      </div>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        error,
        isLoading: isLoading && !error,
        isAuthenticated: !isLoading && !error && isAuthenticated,
        login: handleLogin,
        logout: handleLogout,
        user,
        tokenMetadata,
        isInvitation: !!invitation
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children, ...props }: AuthProviderProps) {
  const providerConfig: Auth0ProviderOptions = {
    domain: auth0Domain,
    clientId: props.clientId ?? auth0ClientId,
    authorizationParams: { audience: auth0Audience },
    cookieDomain: props.setCookieForCurrentDomain ? undefined : auth0CookieDomain,
    onRedirectCallback,
  };

  return (
    <Auth0Provider {...providerConfig}>
      <InnerAuthProvider {...props}>{children}</InnerAuthProvider>
    </Auth0Provider>
  );
}

const onRedirectCallback = (appState?: AppState) => {
  if(appState?.returnTo)
    window.location.href = appState?.returnTo
};
