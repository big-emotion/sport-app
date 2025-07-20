import React, { useEffect, useState } from "react";
import { StyleSheet, View, Alert, TouchableOpacity } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

import { SportPlace, SportPlacesResponse, CreateMarkerData } from "@/types/api";
import { MAP_CONFIG } from "@/constants/Map";
import { fetchFromApi } from "@/services/apiClient";
import GeolocationButton from "./GeolocationButton";
import SportPlaceDetails from "./SportPlaceDetails";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CustomMarker from "./CustomMarker";
import MapCluster from "./MapCluster";
import { useMapClustering } from "@/hooks/useMapClustering";
import SearchBar from "./SearchBar";
import FilterModal from "./FilterModal";
import { cacheService } from "@/services/cacheService";
import { useAuth } from "@/contexts/AuthContext";
import { useCustomMarkers } from "@/hooks/useCustomMarkers";
import AccountWidget from "@/components/auth/AccountWidget";
import AddMarkerModal from "./AddMarkerModal";
import { useMapNavigation } from "@/hooks/useMapNavigation";

export default function MapContainer() {
  const [allSportPlaces, setAllSportPlaces] = useState<SportPlace[]>([]);
  const [filteredSportPlaces, setFilteredSportPlaces] = useState<SportPlace[]>(
    []
  );
  const [selectedPlace, setSelectedPlace] = useState<SportPlace | null>(null);
  const [mapRef, setMapRef] = useState<MapView | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Nouveaux états pour l'ajout de marqueurs
  const [showAddMarker, setShowAddMarker] = useState(false);
  const [newMarkerPosition, setNewMarkerPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Hooks d'authentification et de marqueurs personnalisés
  const { isAuthenticated } = useAuth();
  const { markers: customMarkers, addMarker } = useCustomMarkers();
  const { updateRegion, getCurrentNavigationParams } = useMapNavigation();

  // Combiner tous les marqueurs (officiels + custom)
  const allMarkers: SportPlace[] = [
    ...filteredSportPlaces.map((place) => ({
      ...place,
      type: "official" as const,
    })),
    ...customMarkers.map((marker) => ({
      id: marker.id,
      name: marker.description || "Marqueur personnalisé",
      description: marker.description || "Marqueur personnalisé",
      latitude: marker.latitude,
      longitude: marker.longitude,
      address: marker.address,
      type: "custom" as const,
      userId: marker.userId,
      createdAt: marker.createdAt,
    })),
  ];

  // Utiliser le clustering sur tous les marqueurs combinés
  const { clusters, markers } = useMapClustering(allMarkers, currentRegion);

  useEffect(() => {
    loadSportPlaces();
  }, []);

  const loadSportPlaces = async () => {
    try {
      setLoading(true);
      setError(null);

      // Vérifier le cache d'abord
      const cachedPlaces = cacheService.getSportPlaces();
      if (cachedPlaces) {
        setAllSportPlaces(cachedPlaces);
        setFilteredSportPlaces(cachedPlaces);
        setLoading(false);
        return;
      }

      const data = await fetchFromApi<SportPlacesResponse>("/api/sport-places");
      setAllSportPlaces(data.sportPlaces);
      setFilteredSportPlaces(data.sportPlaces);

      // Sauvegarder dans le cache
      cacheService.setSportPlaces(data.sportPlaces);
    } catch (error) {
      console.error("Erreur lors du chargement des lieux:", error);
      const errorMessage =
        "Impossible de charger les lieux de sport. Vérifiez votre connexion.";
      setError(errorMessage);
      Alert.alert(
        "Erreur de connexion",
        errorMessage +
          '\n\nAppuyez sur "Réessayer" pour relancer le chargement.',
        [
          { text: "Annuler", style: "cancel" },
          { text: "Réessayer", onPress: loadSportPlaces },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerPress = (place: SportPlace) => {
    setSelectedPlace(place);
    setShowDetails(true);
  };

  const handleMapPress = () => {
    setSelectedPlace(null);
    setShowDetails(false);
  };

  // Nouveau: Gestion du long press pour ajouter marqueur
  const handleLongPress = (event: any) => {
    if (!isAuthenticated) {
      Alert.alert(
        "Connexion requise",
        "Connectez-vous pour ajouter des marqueurs personnalisés"
      );
      return;
    }

    const { latitude, longitude } = event.nativeEvent.coordinate;
    setNewMarkerPosition({ latitude, longitude });
    setShowAddMarker(true);
  };

  // Nouveau: Ajouter un marqueur personnalisé
  const handleAddMarker = async (data: CreateMarkerData) => {
    try {
      await addMarker(data);
    } catch (error) {
      console.error("Failed to add marker:", error);
      throw error; // Le modal gérera l'affichage de l'erreur
    }
  };

  // Gérer les changements de région de la carte
  const handleRegionChange = (region: Region) => {
    setCurrentRegion(region);
    updateRegion(region);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedPlace(null);
  };

  const handleSearchPlace = (place: SportPlace) => {
    setShowSearch(false);
    setSelectedPlace(place);
    setShowDetails(true);

    // Centrer la carte sur le lieu sélectionné
    if (mapRef && place.latitude && place.longitude) {
      mapRef.animateToRegion(
        {
          latitude: place.latitude,
          longitude: place.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  };

  if (loading) {
    return <LoadingSpinner message="Chargement de la carte..." />;
  }

  return (
    <View style={styles.container}>
      {/* AccountWidget en overlay */}
      <AccountWidget currentMapParams={getCurrentNavigationParams()} />

      <MapView
        ref={setMapRef}
        style={styles.map}
        initialRegion={MAP_CONFIG.initialRegion}
        onPress={handleMapPress}
        onLongPress={handleLongPress} // Nouveau: ajout de marqueurs
        onRegionChangeComplete={handleRegionChange}
        showsUserLocation={true}
        showsMyLocationButton={false} // On utilise notre bouton custom
      >
        {/* Marqueurs individuels */}
        {markers
          .filter((place) => place.latitude != null && place.longitude != null)
          .map((place, index) => (
            <Marker
              key={`marker-${place.latitude}-${place.longitude}-${index}`}
              coordinate={{
                latitude: place.latitude!,
                longitude: place.longitude!,
              }}
              title={place.name}
              description={place.description}
              onPress={() => handleMarkerPress(place)}
            >
              <CustomMarker sportType={place.name} size={35} />
            </Marker>
          ))}

        {/* Clusters */}
        {clusters.map((cluster) => (
          <Marker
            key={cluster.id}
            coordinate={{
              latitude: cluster.latitude,
              longitude: cluster.longitude,
            }}
            onPress={() => {
              // Zoomer sur le cluster
              if (mapRef) {
                mapRef.animateToRegion(
                  {
                    latitude: cluster.latitude,
                    longitude: cluster.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  },
                  1000
                );
              }
            }}
          >
            <MapCluster count={cluster.count} />
          </Marker>
        ))}
      </MapView>

      <GeolocationButton mapRef={mapRef} />

      {/* Bouton de recherche */}
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => setShowSearch(true)}
      >
        <Ionicons name="search" size={24} color="#2563eb" />
      </TouchableOpacity>

      {/* Barre de recherche */}
      {showSearch && (
        <SearchBar
          places={allSportPlaces}
          onPlaceSelect={handleSearchPlace}
          onClose={() => setShowSearch(false)}
        />
      )}

      {/* Bouton de filtres */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowFilters(true)}
      >
        <Ionicons name="filter" size={24} color="#2563eb" />
      </TouchableOpacity>

      {/* Modal de filtres */}
      <FilterModal
        visible={showFilters}
        places={allSportPlaces}
        onClose={() => setShowFilters(false)}
        onApplyFilters={setFilteredSportPlaces}
      />

      <SportPlaceDetails
        place={selectedPlace}
        visible={showDetails}
        onClose={handleCloseDetails}
      />

      {/* Modal d'ajout de marqueur */}
      {newMarkerPosition && (
        <AddMarkerModal
          visible={showAddMarker}
          onClose={() => {
            setShowAddMarker(false);
            setNewMarkerPosition(null);
          }}
          onAdd={handleAddMarker}
          latitude={newMarkerPosition.latitude}
          longitude={newMarkerPosition.longitude}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "white",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "white",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
