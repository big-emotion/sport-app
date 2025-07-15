import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CustomMarkerProps {
  sportType?: string;
  size?: number;
}

export default function CustomMarker({
  sportType = "fitness",
  size = 30,
}: CustomMarkerProps) {
  const getIconName = (sport: string): keyof typeof Ionicons.glyphMap => {
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

  const getMarkerColor = (sport: string): string => {
    const sportColors: Record<string, string> = {
      football: "#4CAF50", // Vert
      basketball: "#FF9800", // Orange
      tennis: "#2196F3", // Bleu
      natation: "#00BCD4", // Cyan
      running: "#9C27B0", // Violet
      cycling: "#FF5722", // Rouge-orange
      fitness: "#607D8B", // Bleu-gris
      volleyball: "#FFC107", // Jaune
      default: "#F44336", // Rouge
    };

    return sportColors[sport.toLowerCase()] || sportColors["default"];
  };

  const iconName = getIconName(sportType);
  const backgroundColor = getMarkerColor(sportType);

  return (
    <View
      style={[styles.container, { backgroundColor, width: size, height: size }]}
    >
      <Ionicons name={iconName} size={size * 0.6} color="white" />
      <View style={[styles.triangle, { borderTopColor: backgroundColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
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
  triangle: {
    position: "absolute",
    bottom: -8,
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
});
