import * as SecureStore from "expo-secure-store";
import { User } from "@/types/auth";

const TOKEN_KEY = "auth_token";
const USER_KEY = "user_data";

export const secureStorage = {
  async setToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error("Failed to save token:", error);
      throw new Error("Failed to save authentication token");
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error("Failed to get token:", error);
      return null;
    }
  },

  async setUser(user: User): Promise<void> {
    try {
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Failed to save user:", error);
      throw new Error("Failed to save user data");
    }
  },

  async getUser(): Promise<User | null> {
    try {
      const userData = await SecureStore.getItemAsync(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Failed to get user:", error);
      return null;
    }
  },

  async clearAll(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        SecureStore.deleteItemAsync(USER_KEY),
      ]);
    } catch (error) {
      console.error("Failed to clear storage:", error);
      // Ne pas throw ici car on veut nettoyer même en cas d'erreur
    }
  },
};
