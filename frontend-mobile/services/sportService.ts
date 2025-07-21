import { fetchFromApi } from "./apiClient";

export interface Sport {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  createdAt: string;
  _count: {
    sportPlaces: number;
  };
}

export const sportService = {
  async getAll(): Promise<Sport[]> {
    try {
      const sports = await fetchFromApi<Sport[]>("/api/sports");
      return sports;
    } catch (error) {
      console.error("Failed to fetch sports:", error);
      throw new Error("Impossible de récupérer la liste des sports");
    }
  },

  async getById(id: string): Promise<Sport | null> {
    try {
      const sport = await fetchFromApi<Sport>(`/api/sports/${id}`);
      return sport;
    } catch (error) {
      console.error("Failed to fetch sport:", error);
      return null;
    }
  },

  // Récupérer un sport par défaut pour les marqueurs personnalisés
  async getDefaultSport(): Promise<Sport | null> {
    try {
      const sports = await this.getAll();
      // Chercher "Football" en premier, sinon prendre le premier disponible
      const defaultSport =
        sports.find((sport) => sport.name.toLowerCase() === "football") ||
        sports[0];
      return defaultSport || null;
    } catch (error) {
      console.error("Failed to get default sport:", error);
      return null;
    }
  },
};
