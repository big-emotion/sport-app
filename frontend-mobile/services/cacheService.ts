import { SportPlace } from "@/types/api";

class CacheService {
  private sportPlacesCache: SportPlace[] | null = null;
  private cacheTimestamp: number | null = null;
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  setSportPlaces(places: SportPlace[]): void {
    this.sportPlacesCache = places;
    this.cacheTimestamp = Date.now();
  }

  getSportPlaces(): SportPlace[] | null {
    if (!this.sportPlacesCache || !this.cacheTimestamp) {
      return null;
    }

    // Vérifier si le cache est expiré
    if (Date.now() - this.cacheTimestamp > this.CACHE_DURATION) {
      this.clearCache();
      return null;
    }

    return this.sportPlacesCache;
  }

  clearCache(): void {
    this.sportPlacesCache = null;
    this.cacheTimestamp = null;
  }

  isCacheValid(): boolean {
    return (
      this.sportPlacesCache !== null &&
      this.cacheTimestamp !== null &&
      Date.now() - this.cacheTimestamp <= this.CACHE_DURATION
    );
  }
}

export const cacheService = new CacheService();
