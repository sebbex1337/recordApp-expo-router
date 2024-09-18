import { View, Text, FlatList, Image, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import { collection } from "firebase/firestore";
import { database } from "@/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { Record } from "@/types/types";
import { useRouter } from "expo-router";

export default function RecordsList() {
  const [values, loading, error] = useCollection(collection(database, "records"));
  const data = values?.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Record[];
  const router = useRouter();

  return (
    <View>
      <Text className="text-xl text-teal-800 text-center mt-2">My LP collection</Text>
      <FlatList
        className=""
        data={data}
        numColumns={2}
        keyExtractor={(record) => record.id}
        renderItem={(record) => (
          <Pressable className="w-1/2 p-2" onPress={() => router.push(`/${record.item.id}`)}>
            <View className="rounded-lg p-2">
              <Text className="text-center my-2">{record.item.name}</Text>
              <Image source={{ uri: record.item.url }} className="w-full h-40 rounded-lg" />
            </View>
          </Pressable>
        )}
      />

      <StatusBar style="auto" />
    </View>
  );
}
