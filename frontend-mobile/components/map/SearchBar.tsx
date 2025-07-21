import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SportPlace } from "@/types/api";

interface SearchBarProps {
  places: SportPlace[];
  onPlaceSelect: (place: SportPlace) => void;
  onClose: () => void;
}

export default function SearchBar({
  places,
  onPlaceSelect,
  onClose,
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPlaces, setFilteredPlaces] = useState<SportPlace[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.length === 0) {
      setFilteredPlaces([]);
      return;
    }

    const filtered = places.filter(
      (place) =>
        place.name.toLowerCase().includes(query.toLowerCase()) ||
        place.description.toLowerCase().includes(query.toLowerCase()) ||
        (place.address &&
          place.address.toLowerCase().includes(query.toLowerCase()))
    );

    setFilteredPlaces(filtered.slice(0, 10)); // Limiter à 10 résultats
  };

  const handlePlaceSelect = (place: SportPlace) => {
    setSearchQuery("");
    setFilteredPlaces([]);
    onPlaceSelect(place);
  };

  const renderSearchResult = ({ item }: { item: SportPlace }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handlePlaceSelect(item)}
    >
      <View style={styles.resultContent}>
        <Text style={styles.resultName}>{item.name}</Text>
        {item.address && (
          <Text style={styles.resultAddress}>{item.address}</Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchInputContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un lieu..."
          value={searchQuery}
          onChangeText={handleSearch}
          autoFocus
        />
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {filteredPlaces.length > 0 && (
        <FlatList
          data={filteredPlaces}
          renderItem={renderSearchResult}
          keyExtractor={(item, index) =>
            `${item.latitude}-${item.longitude}-${index}`
          }
          style={styles.resultsList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    zIndex: 1000,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  resultsList: {
    maxHeight: 300,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  resultContent: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  resultAddress: {
    fontSize: 14,
    color: "#666",
  },
});
