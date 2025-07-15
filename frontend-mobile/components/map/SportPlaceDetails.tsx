import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Linking,
  Alert,
  Share,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { SportPlace } from "@/types/api";

interface SportPlaceDetailsProps {
  place: SportPlace | null;
  visible: boolean;
  onClose: () => void;
}

export default function SportPlaceDetails({
  place,
  visible,
  onClose,
}: SportPlaceDetailsProps) {
  if (!place) return null;

  const handleNavigation = async () => {
    if (!place.latitude || !place.longitude) {
      Alert.alert("Erreur", "Coordonnées de localisation non disponibles");
      return;
    }

    const destination = `${place.latitude},${place.longitude}`;

    // URLs pour différentes apps de navigation
    const urls = {
      appleMaps: `http://maps.apple.com/?daddr=${destination}`,
      googleMaps: `https://www.google.com/maps/dir/?api=1&destination=${destination}`,
      waze: `https://waze.com/ul?ll=${destination}&navigate=yes`,
    };

    try {
      if (Platform.OS === "ios") {
        // Sur iOS, essayer Apple Maps en premier
        const supported = await Linking.canOpenURL(urls.appleMaps);
        if (supported) {
          await Linking.openURL(urls.appleMaps);
        } else {
          await Linking.openURL(urls.googleMaps);
        }
      } else {
        // Sur Android, essayer Google Maps
        const supported = await Linking.canOpenURL(urls.googleMaps);
        if (supported) {
          await Linking.openURL(urls.googleMaps);
        } else {
          await Linking.openURL(urls.appleMaps);
        }
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'ouvrir l'application de navigation");
    }
  };

  const handleShare = async () => {
    try {
      const shareContent = {
        message: `Découvrez ${place.name} - ${place.description}${
          place.address ? `\nAdresse: ${place.address}` : ""
        }`,
        url: `https://maps.google.com/maps?q=${place.latitude},${place.longitude}`,
        title: place.name,
      };

      await Share.share(shareContent);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de partager ce lieu");
    }
  };

  const handleCall = () => {
    // Placeholder pour future fonctionnalité
    Alert.alert(
      "Bientôt disponible",
      "La fonction d'appel sera bientôt disponible"
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.dragIndicator} />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{place.name}</Text>
            <Text style={styles.address}>{place.address}</Text>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{place.description}</Text>
          </View>

          {/* Actions */}
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleNavigation}
            >
              <Ionicons name="navigate" size={20} color="#2563eb" />
              <Text style={styles.actionText}>Itinéraire</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
              <Ionicons name="call" size={20} color="#2563eb" />
              <Text style={styles.actionText}>Appeler</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Ionicons name="share" size={20} color="#2563eb" />
              <Text style={styles.actionText}>Partager</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 12,
    paddingHorizontal: 16,
    position: "relative",
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 12,
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  descriptionSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
  },
  actionsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  actionButton: {
    alignItems: "center",
    padding: 12,
  },
  actionText: {
    marginTop: 4,
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "500",
  },
});
