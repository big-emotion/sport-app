import React from "react";
import { StyleSheet, TouchableOpacity, Alert } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

interface GeolocationButtonProps {
  mapRef: MapView | null;
}

export default function GeolocationButton({ mapRef }: GeolocationButtonProps) {
  const handleLocationPress = async () => {
    try {
      // Demander les permissions de localisation
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "Veuillez autoriser l'accès à votre position pour utiliser cette fonctionnalité."
        );
        return;
      }

      // Obtenir la position actuelle
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;

      // Centrer la carte sur la position de l'utilisateur
      if (mapRef) {
        mapRef.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000
        );
      }
    } catch (error) {
      console.error("Erreur de géolocalisation:", error);
      Alert.alert("Erreur", "Impossible d'obtenir votre position");
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleLocationPress}
      activeOpacity={0.7}
    >
      <Ionicons name="locate" size={24} color="#2563eb" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 100,
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
