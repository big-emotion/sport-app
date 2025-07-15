import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface MapClusterProps {
  count: number;
  size?: number;
}

export default function MapCluster({ count, size = 40 }: MapClusterProps) {
  const getClusterColor = (pointCount: number): string => {
    if (pointCount < 10) return "#4CAF50";
    if (pointCount < 25) return "#FF9800";
    if (pointCount < 50) return "#FF5722";
    return "#9C27B0";
  };

  const backgroundColor = getClusterColor(count);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.3 }]}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
});
