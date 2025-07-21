import React from "react";
import { StyleSheet, View, StatusBar } from "react-native";

import MapContainer from "@/components/map/MapContainer";

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <MapContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
