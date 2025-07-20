import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LoginModal from "./LoginModal";

export default function LoginButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsModalOpen(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="person" size={20} color="#fff" />
        <Text style={styles.buttonText}>Connexion</Text>
      </TouchableOpacity>

      <LoginModal visible={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    gap: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
