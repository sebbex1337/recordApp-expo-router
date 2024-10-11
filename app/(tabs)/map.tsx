import { database } from "@/firebase";
import { addDoc, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import MapView, { LongPressEvent, Marker } from "react-native-maps";
import { MapMarker } from "../../types/types";
import { useCollection } from "react-firebase-hooks/firestore";

export default function Map() {
  // Load the markers from firebase
  const [values, loading, error] = useCollection(collection(database, "markers"));
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [region, setRegion] = useState({
    latitude: 55,
    longitude: 11,
    latitudeDelta: 8,
    longitudeDelta: 8,
  });

  // Update the markers when the values changes and fetch the data from firebase
  useEffect(() => {
    if (values) {
      const data = values.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as MapMarker[];
      setMarkers(data);
    }
  }, [values]);

  async function addMarker(data: LongPressEvent) {
    const { latitude, longitude } = data.nativeEvent.coordinate;

    // Prompt the user for a title instead of hardcoding it
    Alert.prompt(
      "New Marker",
      "Enter a title for the marker",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: async (title) => {
            if (title) {
              // Add the marker to firebase
              const docRef = await addDoc(collection(database, "markers"), {
                coordinate: { latitude, longitude },
                title,
              });
              const newMarker: MapMarker = {
                coordinate: { latitude, longitude },
                title,
                // Add the id from firebase to the marker
                id: docRef.id,
              };
              // Update the state to show the marker on the map
              setMarkers([...markers, newMarker]);
            }
          },
        },
      ],
      "plain-text"
    );
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" }}>
      <MapView style={{ width: "100%", height: "100%" }} region={region} onLongPress={addMarker}>
        {markers.map((marker) => (
          <Marker key={marker.id} coordinate={marker.coordinate} title={marker.title} />
        ))}
      </MapView>
    </View>
  );
}
