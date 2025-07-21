import { AuthResponse, LoginCredentials, User } from "@/types/auth";
import { postToApi, fetchFromApi } from "./apiClient";
import { secureStorage } from "./secureStorage";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await postToApi<AuthResponse>(
        "/api/auth/login",
        "POST",
        credentials
      );

      // Sauvegarder token et user
      await Promise.all([
        secureStorage.setToken(response.token),
        secureStorage.setUser(response.user),
      ]);

      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Échec de la connexion. Vérifiez vos identifiants.");
    }
  },

  async logout(): Promise<void> {
    try {
      // Tenter d'appeler l'API de logout
      await postToApi("/api/auth/logout", "POST");
    } catch (error) {
      console.warn("Logout API call failed:", error);
      // On continue même si l'API échoue
    } finally {
      // Nettoyer le stockage local dans tous les cas
      await secureStorage.clearAll();
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await fetchFromApi<User>("/api/auth/me");
      // Mettre à jour le cache local
      await secureStorage.setUser(user);
      return user;
    } catch (error) {
      console.error("Failed to get current user:", error);
      // Si l'API échoue, nettoyer le cache (token probablement expiré)
      await secureStorage.clearAll();
      return null;
    }
  },

  async getStoredAuthData(): Promise<{
    user: User | null;
    token: string | null;
  }> {
    try {
      const [user, token] = await Promise.all([
        secureStorage.getUser(),
        secureStorage.getToken(),
      ]);
      return { user, token };
    } catch (error) {
      console.error("Failed to get stored auth data:", error);
      return { user: null, token: null };
    }
  },

  async isTokenValid(): Promise<boolean> {
    try {
      const token = await secureStorage.getToken();
      if (!token) return false;

      // Vérifier la validité du token en tentant de récupérer l'utilisateur
      const user = await this.getCurrentUser();
      return user !== null;
    } catch (error) {
      return false;
    }
  },
};
