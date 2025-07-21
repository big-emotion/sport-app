import { useMemo } from "react";
import { Region } from "react-native-maps";
import { SportPlace } from "@/types/api";

interface ClusterPoint {
  id: string;
  latitude: number;
  longitude: number;
  data: SportPlace;
}

interface Cluster {
  id: string;
  latitude: number;
  longitude: number;
  count: number;
  data?: SportPlace[];
}

export function useMapClustering(
  places: SportPlace[],
  region: Region | null,
  minZoom: number = 10
) {
  return useMemo(() => {
    if (!region || places.length === 0) {
      return { clusters: [], markers: places };
    }

    // Calculer le niveau de zoom approximatif
    const zoomLevel = Math.round(
      Math.log(360 / region.longitudeDelta) / Math.LN2
    );

    // Si le zoom est suffisant ou peu de marqueurs, ne pas clustériser
    if (zoomLevel > minZoom || places.length < 10) {
      return { clusters: [], markers: places };
    }

    // Algorithme de clustering simple basé sur la distance
    const clusters: Cluster[] = [];
    const processed = new Set<number>();
    const clusterDistance = 0.01; // Distance approximative pour regrouper

    places.forEach((place, index) => {
      if (processed.has(index)) return;

      const cluster: Cluster = {
        id: `cluster-${index}`,
        latitude: place.latitude,
        longitude: place.longitude,
        count: 1,
        data: [place],
      };

      // Trouver les points proches
      places.forEach((otherPlace, otherIndex) => {
        if (otherIndex === index || processed.has(otherIndex)) return;

        const distance = Math.sqrt(
          Math.pow(place.latitude - otherPlace.latitude, 2) +
            Math.pow(place.longitude - otherPlace.longitude, 2)
        );

        if (distance < clusterDistance) {
          cluster.count++;
          cluster.data!.push(otherPlace);
          cluster.latitude = (cluster.latitude + otherPlace.latitude) / 2;
          cluster.longitude = (cluster.longitude + otherPlace.longitude) / 2;
          processed.add(otherIndex);
        }
      });

      processed.add(index);
      clusters.push(cluster);
    });

    // Séparer clusters (>1 point) et marqueurs individuels
    const finalClusters = clusters.filter((c) => c.count > 1);
    const individualMarkers = clusters
      .filter((c) => c.count === 1)
      .map((c) => c.data![0]);

    return {
      clusters: finalClusters,
      markers: individualMarkers,
    };
  }, [places, region, minZoom]);
}
