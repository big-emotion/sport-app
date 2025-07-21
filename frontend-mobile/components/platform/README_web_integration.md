# Intégration Bouton Mobile dans Frontend-Web

## 📱 Code à Ajouter dans Frontend-Web

### 1. Service Platform (côté Web)

Créer `frontend-web/src/services/platformService.ts` :

```typescript
export interface NavigationParams {
  latitude?: number;
  longitude?: number;
  zoom?: number;
}

export const platformService = {
  /**
   * Génère un lien vers l'application mobile
   */
  generateMobileLink(params?: NavigationParams): string {
    const baseUrl = "sportapp://map";
    const url = new URL(baseUrl);

    if (params?.latitude && params?.longitude) {
      url.searchParams.set("lat", params.latitude.toString());
      url.searchParams.set("lng", params.longitude.toString());
    }

    if (params?.zoom) {
      url.searchParams.set("zoom", params.zoom.toString());
    }

    return url.toString();
  },

  /**
   * Tente d'ouvrir l'app mobile, redirige vers App Store sinon
   */
  async openMobileApp(params?: NavigationParams): Promise<void> {
    const mobileUrl = this.generateMobileLink(params);

    // Créer un iframe invisible pour tester si l'app est installée
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = mobileUrl;
    document.body.appendChild(iframe);

    // Timeout pour rediriger vers App Store si l'app ne s'ouvre pas
    const timeout = setTimeout(() => {
      window.open("https://apps.apple.com/your-app-link", "_blank");
      // ou pour Android: window.open('https://play.google.com/store/apps/details?id=your.app.id', '_blank');
    }, 2500);

    // Nettoyer
    setTimeout(() => {
      clearTimeout(timeout);
      document.body.removeChild(iframe);
    }, 3000);
  },

  /**
   * Parse les paramètres d'URL pour partage cross-platform
   */
  parseUrlParams(): NavigationParams | null {
    const params = new URLSearchParams(window.location.search);
    const lat = params.get("lat");
    const lng = params.get("lng");
    const zoom = params.get("zoom");

    if (lat && lng) {
      return {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        zoom: zoom ? parseFloat(zoom) : undefined,
      };
    }

    return null;
  },
};
```

### 2. Composant Bouton Mobile

Créer `frontend-web/src/components/ui/MobileAppButton.tsx` :

```tsx
"use client";

import { useState } from "react";
import { platformService, NavigationParams } from "@/services/platformService";

interface MobileAppButtonProps {
  currentMapParams?: NavigationParams | null;
  className?: string;
}

export default function MobileAppButton({
  currentMapParams,
  className = "",
}: MobileAppButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenMobileApp = async () => {
    setIsLoading(true);
    try {
      await platformService.openMobileApp(currentMapParams || undefined);
    } catch (error) {
      console.error("Failed to open mobile app:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 3000);
    }
  };

  return (
    <button
      onClick={handleOpenMobileApp}
      disabled={isLoading}
      className={`
        inline-flex items-center gap-2 px-4 py-2 
        bg-blue-600 hover:bg-blue-700 text-white 
        rounded-lg transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
      {isLoading ? "Ouverture..." : "Ouvrir l'App"}
    </button>
  );
}
```

### 3. Intégration dans la Navbar/Header

Dans `frontend-web/src/components/ui/Navbar.tsx` ou `Header.tsx` :

```tsx
import MobileAppButton from "./MobileAppButton";

// Dans le composant, récupérer les paramètres de carte actuels
const getCurrentMapParams = (): NavigationParams | null => {
  // Logique pour récupérer lat/lng/zoom de votre état de carte actuel
  // Par exemple depuis un contexte ou state management
  return {
    latitude: currentLatitude,
    longitude: currentLongitude,
    zoom: currentZoom,
  };
};

// Dans le JSX, ajouter le bouton
<MobileAppButton
  currentMapParams={getCurrentMapParams()}
  className="hidden md:flex" // Masquer sur mobile
/>;
```

### 4. Page de Redirection Mobile

Créer `frontend-web/src/app/app-redirect/page.tsx` :

```tsx
"use client";

import { useEffect } from "react";
import { platformService } from "@/services/platformService";

export default function AppRedirectPage() {
  useEffect(() => {
    const params = platformService.parseUrlParams();
    platformService.openMobileApp(params);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Ouverture de l'application mobile...
        </h1>
        <p className="text-gray-600">
          Si l'application ne s'ouvre pas automatiquement, vous serez redirigé
          vers l'App Store.
        </p>
      </div>
    </div>
  );
}
```

## 🔧 Configuration

### Variables d'Environnement

Dans `frontend-web/.env.local` :

```
NEXT_PUBLIC_MOBILE_APP_SCHEME=sportapp
NEXT_PUBLIC_IOS_APP_STORE_URL=https://apps.apple.com/your-app-link
NEXT_PUBLIC_ANDROID_PLAY_STORE_URL=https://play.google.com/store/apps/details?id=your.app.id
```

## 🚀 Test en Local

1. **Mobile → Web** : Déjà fonctionnel avec votre implémentation
2. **Web → Mobile** :
   - Tester sur appareil physique avec l'app installée
   - Vérifier le fallback vers App Store
   - Tester les paramètres de navigation (lat/lng/zoom)

## 📱 Deep Linking (App Mobile)

Votre app mobile écoutera automatiquement les URLs `sportapp://map?lat=...&lng=...&zoom=...`

Pour gérer ces paramètres dans l'app :

```typescript
// Dans _layout.tsx ou app.tsx
import { useEffect } from "react";
import { Linking } from "expo-linking";
import { platformService } from "@/services/platformService";

useEffect(() => {
  const handleURL = (url: string) => {
    const params = platformService.parseUrlParams(url);
    if (params) {
      // Naviguer vers la carte avec ces paramètres
      // Par exemple: navigation vers /map avec les coordonnées
    }
  };

  Linking.addEventListener("url", handleURL);

  // Gérer l'URL d'ouverture initiale
  Linking.getInitialURL().then((url) => {
    if (url) handleURL(url);
  });

  return () => Linking.removeAllListeners("url");
}, []);
```

## ✅ Checklist d'Intégration

- [ ] Ajouter le service platformService côté web
- [ ] Créer le composant MobileAppButton
- [ ] Intégrer dans la navbar/header
- [ ] Créer la page app-redirect
- [ ] Configurer les variables d'environnement
- [ ] Tester sur appareil physique
- [ ] Configurer les liens App Store/Play Store
- [ ] Gérer le deep linking dans l'app mobile
