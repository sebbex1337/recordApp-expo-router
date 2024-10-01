import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { Record } from "@/types/types";
import { database, storage } from "@/firebase";
import { deleteDoc, doc, getDoc, Timestamp } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import uuid from "react-native-uuid";

export default function RecordDetails() {
  const { recordId } = useLocalSearchParams();
  const [record, setRecord] = useState<Record | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const router = useRouter();

  // Get the record from firebase
  useEffect(() => {
    async function fetchRecord() {
      if (recordId) {
        const docRef = doc(database, "records", recordId as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setRecord({ ...data, id: docSnap.id, releaseDate: (data.releaseDate as Timestamp).toDate() } as Record);
        }
      }
    }
    // Get the images from the storage
    async function fetchImages() {
      if (recordId) {
        const imagesRef = ref(storage, `images/${recordId}`);
        const imageList = await listAll(imagesRef);
        const urls = await Promise.all(imageList.items.map(async (item) => await getDownloadURL(item)));
        setImageUrls(urls);
      }
    }
    // Make sure they're fetched from storage when loading the page
    fetchImages();
    fetchRecord();
  }, [recordId]);

  async function deleteRecord(id: string) {
    await deleteDoc(doc(database, "records", id));
    router.back();
  }

  async function chooseAndUploadImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });
    if (!result.canceled) {
      const imagePath = result.assets[0].uri;
      const res = await fetch(imagePath);
      const blob = await res.blob();
      const imageName = uuid.v4();
      const storageRef = ref(storage, `images/${recordId}/${imageName}`);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      setImageUrls((prevUrls) => [...prevUrls, url]);
      alert("Image uploaded successfully");
    }
  }

  if (!record) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-4xl font-bold">{record.name}</Text>
      <Image source={{ uri: record.url }} className="w-36 h-36" />
      <Text className="text-2xl font-bold">{record.artist}</Text>
      <Text className="text-xl">{record.releaseDate.toDateString()}</Text>
      <Text className="my-2">Images</Text>
      <FlatList
        data={imageUrls}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View /* className="flex-1 flex-col m-1" */>
            <Image source={{ uri: item }} className="h-36 w-36 m-2" />
          </View>
        )}
        contentContainerStyle={{ alignItems: "center" }}
      />

      <Pressable className="mt-8 rounded-xl bg-blue-500 p-3" onPress={chooseAndUploadImage}>
        <Text>Upload Image</Text>
      </Pressable>
      <Pressable className="mt-8 rounded-xl bg-red-600 p-3" onPress={() => deleteRecord(record.id)}>
        <Text>Delete this Record</Text>
      </Pressable>
    </View>
  );
}
