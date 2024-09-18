import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Record } from "@/types/types";
import { database } from "@/firebase";
import { deleteDoc, doc, getDoc, Timestamp } from "firebase/firestore";

export default function RecordDetails() {
  const { recordId } = useLocalSearchParams();
  const [record, setRecord] = useState<Record | null>(null);
  const router = useRouter();

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
    fetchRecord();
  }, [recordId]);

  async function deleteRecord(id: string) {
    await deleteDoc(doc(database, "records", id));
    router.back();
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
      <Image source={{ uri: record.url }} style={{ width: 150, height: 150 }} />
      <Text className="text-2xl font-bold">{record.artist}</Text>
      <Text className="text-xl">{record.releaseDate.toDateString()}</Text>
      <Pressable className="mt-8 rounded-xl bg-red-600 p-3" onPress={() => deleteRecord(record.id)}>
        <Text className="">Delete this Record</Text>
      </Pressable>
    </View>
  );
}
