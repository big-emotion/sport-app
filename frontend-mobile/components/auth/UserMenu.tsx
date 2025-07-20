import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/types/auth";
import { platformService, NavigationParams } from "@/services/platformService";

interface UserMenuProps {
  user: User;
  currentMapParams?: NavigationParams | null;
}

export default function UserMenu({ user, currentMapParams }: UserMenuProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Déconnexion",
        style: "destructive",
        onPress: async () => {
          setMenuVisible(false);
          await logout();
        },
      },
    ]);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleOpenWebVersion = async () => {
    setMenuVisible(false);
    try {
      await platformService.openWebVersion(currentMapParams || undefined);
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Impossible d'ouvrir la version web. Vérifiez votre connexion."
      );
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.avatarButton}
        onPress={() => setMenuVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.avatarText}>
          {getInitials(user.firstName, user.lastName)}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menu}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarTextLarge}>
                  {getInitials(user.firstName, user.lastName)}
                </Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>
                  {user.firstName} {user.lastName}
                </Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
            </View>

            <View style={styles.menuItems}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  Alert.alert(
                    "Profil",
                    "Cette fonctionnalité sera bientôt disponible"
                  );
                }}
              >
                <Ionicons name="person-outline" size={20} color="#333" />
                <Text style={styles.menuItemText}>Mon profil</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  Alert.alert(
                    "Favoris",
                    "Cette fonctionnalité sera bientôt disponible"
                  );
                }}
              >
                <Ionicons name="heart-outline" size={20} color="#333" />
                <Text style={styles.menuItemText}>Mes favoris</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  Alert.alert(
                    "Notifications",
                    "Cette fonctionnalité sera bientôt disponible"
                  );
                }}
              >
                <Ionicons name="notifications-outline" size={20} color="#333" />
                <Text style={styles.menuItemText}>Notifications</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleOpenWebVersion}
              >
                <Ionicons name="globe-outline" size={20} color="#2563eb" />
                <Text style={[styles.menuItemText, styles.webVersionText]}>
                  Voir sur Web
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color="#ff3333" />
              <Text style={styles.logoutText}>Déconnexion</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  avatarText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 100,
    paddingRight: 20,
  },
  menu: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    minWidth: 250,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarTextLarge: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  menuItems: {
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
  },
  webVersionText: {
    color: "#2563eb",
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    color: "#ff3333",
    fontWeight: "500",
  },
});
