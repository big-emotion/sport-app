import React from "react";
import { View, StyleSheet } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import LoginButton from "./LoginButton";
import UserMenu from "./UserMenu";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { NavigationParams } from "@/services/platformService";

interface AccountWidgetProps {
  currentMapParams?: NavigationParams | null;
}

export default function AccountWidget({
  currentMapParams,
}: AccountWidgetProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LoadingSpinner size="small" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user ? (
        <UserMenu user={user} currentMapParams={currentMapParams} />
      ) : (
        <LoginButton />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1000,
    // Assurer que le widget est au-dessus de la carte
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
});
