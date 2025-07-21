import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SportPlace } from "@/types/api";

interface FilterModalProps {
  visible: boolean;
  places: SportPlace[];
  onClose: () => void;
  onApplyFilters: (filteredPlaces: SportPlace[]) => void;
}

export default function FilterModal({
  visible,
  places,
  onClose,
  onApplyFilters,
}: FilterModalProps) {
  const [selectedSports, setSelectedSports] = useState<Set<string>>(new Set());
  const [availableSports, setAvailableSports] = useState<string[]>([]);

  useEffect(() => {
    // Extraire les sports uniques des lieux
    const sports = [...new Set(places.map((place) => place.name))];
    setAvailableSports(sports);

    // Par défaut, tous les sports sont sélectionnés
    setSelectedSports(new Set(sports));
  }, [places]);

  const handleSportToggle = (sport: string) => {
    const newSelected = new Set(selectedSports);
    if (newSelected.has(sport)) {
      newSelected.delete(sport);
    } else {
      newSelected.add(sport);
    }
    setSelectedSports(newSelected);
  };

  const handleSelectAll = () => {
    setSelectedSports(new Set(availableSports));
  };

  const handleDeselectAll = () => {
    setSelectedSports(new Set());
  };

  const handleApplyFilters = () => {
    const filteredPlaces = places.filter((place) =>
      selectedSports.has(place.name)
    );
    onApplyFilters(filteredPlaces);
    onClose();
  };

  const handleReset = () => {
    setSelectedSports(new Set(availableSports));
    onApplyFilters(places);
    onClose();
  };

  const getSportIcon = (sport: string): keyof typeof Ionicons.glyphMap => {
    const sportIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
      football: "football",
      basketball: "basketball",
      tennis: "tennisball",
      natation: "water",
      running: "walk",
      cycling: "bicycle",
      fitness: "fitness",
      volleyball: "fitness",
      default: "location",
    };

    return sportIcons[sport.toLowerCase()] || sportIcons["default"];
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
          <Text style={styles.title}>Filtrer par sport</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            onPress={handleSelectAll}
            style={styles.quickButton}
          >
            <Text style={styles.quickButtonText}>Tout sélectionner</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDeselectAll}
            style={styles.quickButton}
          >
            <Text style={styles.quickButtonText}>Tout déselectionner</Text>
          </TouchableOpacity>
        </View>

        {/* Sports List */}
        <ScrollView style={styles.sportsList}>
          {availableSports.map((sport) => (
            <TouchableOpacity
              key={sport}
              style={styles.sportItem}
              onPress={() => handleSportToggle(sport)}
            >
              <View style={styles.sportItemLeft}>
                <Ionicons
                  name={getSportIcon(sport)}
                  size={24}
                  color="#2563eb"
                  style={styles.sportIcon}
                />
                <Text style={styles.sportName}>{sport}</Text>
              </View>
              <Switch
                value={selectedSports.has(sport)}
                onValueChange={() => handleSportToggle(sport)}
                trackColor={{ false: "#ccc", true: "#2563eb" }}
                thumbColor="#fff"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Réinitialiser</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleApplyFilters}
            style={styles.applyButton}
          >
            <Text style={styles.applyButtonText}>
              Appliquer ({selectedSports.size})
            </Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
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
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  quickButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  quickButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  sportsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sportItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sportItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  sportIcon: {
    marginRight: 15,
  },
  sportName: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    gap: 10,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  resetButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  applyButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#2563eb",
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
});
