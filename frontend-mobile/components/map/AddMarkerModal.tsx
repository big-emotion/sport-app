import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CreateMarkerData } from "@/types/markers";
import { geocodingService } from "@/services/geocodingService";

interface AddMarkerModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (data: CreateMarkerData) => Promise<void>;
  latitude: number;
  longitude: number;
}

export default function AddMarkerModal({
  visible,
  onClose,
  onAdd,
  latitude,
  longitude,
}: AddMarkerModalProps) {
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      loadAddress();
      setDescription("");
      setError(null);
    }
  }, [visible, latitude, longitude]);

  const loadAddress = async () => {
    setGeocoding(true);
    try {
      const result = await geocodingService.reverseGeocode(latitude, longitude);
      setAddress(result.address);
    } catch (error) {
      console.error("Geocoding failed:", error);
      setAddress(
        `Coordonnées: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      );
    } finally {
      setGeocoding(false);
    }
  };

  const handleAdd = async () => {
    if (!description.trim()) {
      setError("Veuillez saisir une description");
      return;
    }

    if (description.trim().length < 3) {
      setError("La description doit contenir au moins 3 caractères");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onAdd({
        latitude,
        longitude,
        description: description.trim(),
        address: address,
      });

      // Reset form et fermer modal
      setDescription("");
      onClose();

      Alert.alert("Succès", "Marqueur ajouté avec succès !");
    } catch (error) {
      console.error("Failed to add marker:", error);
      setError("Impossible d'ajouter le marqueur. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDescription("");
    setError(null);
    onClose();
  };

  const coordinatesText = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Ajouter un marqueur</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.locationInfo}>
              <View style={styles.infoRow}>
                <Ionicons name="location" size={20} color="#2563eb" />
                <View style={styles.infoText}>
                  <Text style={styles.label}>Position</Text>
                  <Text style={styles.coordinates}>{coordinatesText}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="map" size={20} color="#2563eb" />
                <View style={styles.infoText}>
                  <Text style={styles.label}>Adresse</Text>
                  {geocoding ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="#2563eb" />
                      <Text style={styles.loadingText}>
                        Recherche de l'adresse...
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.address}>{address}</Text>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description *</Text>
              <TextInput
                style={[styles.textArea, error && styles.inputError]}
                placeholder="Décrivez ce lieu... (ex: Terrain de basket public, Court de tennis couvert, etc.)"
                value={description}
                onChangeText={(text) => {
                  setDescription(text);
                  if (error) setError(null);
                }}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={200}
              />
              <View style={styles.inputFooter}>
                {error && <Text style={styles.errorText}>{error}</Text>}
                <Text style={styles.charCount}>{description.length}/200</Text>
              </View>
            </View>

            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={20} color="#2563eb" />
              <Text style={styles.infoBoxText}>
                Ce marqueur sera visible par tous les utilisateurs de
                l'application.
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.addButton,
                (loading || geocoding || !description.trim()) &&
                  styles.buttonDisabled,
              ]}
              onPress={handleAdd}
              disabled={loading || geocoding || !description.trim()}
            >
              {loading ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.addButtonText}>Ajout en cours...</Text>
                </View>
              ) : (
                <Text style={styles.addButtonText}>Ajouter le marqueur</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  content: {
    padding: 20,
  },
  locationInfo: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  coordinates: {
    fontSize: 14,
    color: "#666",
    fontFamily: "monospace",
  },
  address: {
    fontSize: 14,
    color: "#666",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    height: 100,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  inputError: {
    borderColor: "#ff3333",
  },
  inputFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  errorText: {
    color: "#ff3333",
    fontSize: 14,
  },
  charCount: {
    fontSize: 12,
    color: "#999",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#e7f3ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    gap: 8,
  },
  infoBoxText: {
    flex: 1,
    fontSize: 14,
    color: "#2563eb",
    lineHeight: 18,
  },
  addButton: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
