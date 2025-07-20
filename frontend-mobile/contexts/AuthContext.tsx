import React, { createContext, useContext, useReducer, useEffect } from "react";
import { AuthState, User, LoginCredentials } from "@/types/auth";
import { authService } from "@/services/authService";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Actions pour le reducer
type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: { user: User; token: string } }
  | { type: "CLEAR_AUTH" }
  | { type: "SET_ERROR"; payload: string | null };

// Reducer pour gérer l'état d'authentification
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_USER":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };

    case "CLEAR_AUTH":
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };

    default:
      return state;
  }
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialisation au démarrage de l'app
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const { user, token } = await authService.getStoredAuthData();

      if (user && token) {
        // Vérifier que le token est encore valide
        const isValid = await authService.isTokenValid();
        if (isValid) {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            dispatch({
              type: "SET_USER",
              payload: { user: currentUser, token },
            });
            return;
          }
        }
      }
    } catch (error) {
      console.error("Auth initialization failed:", error);
    }

    dispatch({ type: "SET_LOADING", payload: false });
  };

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await authService.login(credentials);
      dispatch({ type: "SET_USER", payload: response });
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      throw error; // Laisser le composant gérer l'erreur
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch({ type: "CLEAR_AUTH" });
    }
  };

  const refreshUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        const { token } = await authService.getStoredAuthData();
        if (token) {
          dispatch({ type: "SET_USER", payload: { user, token } });
        } else {
          dispatch({ type: "CLEAR_AUTH" });
        }
      } else {
        dispatch({ type: "CLEAR_AUTH" });
      }
    } catch (error) {
      console.error("Refresh user failed:", error);
      dispatch({ type: "CLEAR_AUTH" });
    }
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// Hook pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
