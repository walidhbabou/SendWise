import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TokenResponse, useGoogleLogin } from '@react-oauth/google';

interface AuthContextType {
  accessToken: string | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  userEmail: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem('gmail_access_token')
  );
  const [userEmail, setUserEmail] = useState<string | null>(
    localStorage.getItem('user_email')
  );

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse: TokenResponse) => {
      setAccessToken(tokenResponse.access_token);
      localStorage.setItem('gmail_access_token', tokenResponse.access_token);
      
      // Récupérer les informations de l'utilisateur
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const data = await userInfo.json();
        setUserEmail(data.email);
        localStorage.setItem('user_email', data.email);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    },
    onError: () => {
      console.error('Login Failed');
    },
    scope: 'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.compose',
  });

  const logout = () => {
    setAccessToken(null);
    setUserEmail(null);
    localStorage.removeItem('gmail_access_token');
    localStorage.removeItem('user_email');
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isAuthenticated: !!accessToken,
        login,
        logout,
        userEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
