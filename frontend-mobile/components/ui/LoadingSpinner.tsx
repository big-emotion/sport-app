import React from "react";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";

interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "large";
}

export default function LoadingSpinner({
  message = "Chargement...",
  size = "large",
}: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color="#2563eb" />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
