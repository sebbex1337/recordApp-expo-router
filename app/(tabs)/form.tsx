import { Pressable, Text, TextInput, View, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { Record } from "@/types/types";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { database } from "@/firebase";

export default function HomePage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [artist, setArtist] = useState("");
  const [releaseDate, setReleaseDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();

  async function handlePress() {
    try {
      const docRef = await addDoc(collection(database, "records"), {
        name,
        url,
        artist,
        releaseDate: Timestamp.fromDate(releaseDate),
      });
      setRecords([...records, { id: docRef.id, name, url, artist, releaseDate }]);
      setName("");
      setUrl("");
      setArtist("");
      setReleaseDate(new Date());
      router.push("/"); // Redirect to the home page
    } catch (err) {
      console.error(err);
    }
  }

  function onDateChange(event: DateTimePickerEvent, selectedDate?: Date | undefined) {
    const currentDate = selectedDate || releaseDate;
    setShowDatePicker(false);
    setReleaseDate(currentDate);
  }

  return (
    <View className="flex-1 items-center justify-center bg-[#fff]">
      <Text className="text-4xl text-teal-800">Record App</Text>
      <View className="flex flex-wrap gap-1">
        <TextInput
          className="text-xl w-[300]"
          value={name}
          onChangeText={(name) => setName(name)}
          placeholder="Enter record name"
        />
        <TextInput
          className="text-xl w-[300]"
          value={url}
          onChangeText={(url) => setUrl(url)}
          placeholder="Enter record url image"
        />
        <TextInput
          className="text-xl w-[300]"
          value={artist}
          onChangeText={(artist) => setArtist(artist)}
          placeholder="Enter Artist name"
        />
        <Pressable onPress={() => setShowDatePicker(true)}>
          <Text className="text-xl">{releaseDate.toDateString()}</Text>
        </Pressable>
        {showDatePicker && <DateTimePicker value={releaseDate} mode="date" display="default" onChange={onDateChange} />}
      </View>
      <Pressable className="border rounded-3xl p-2 bg-lime-200 mt-4" onPress={handlePress}>
        <Text className="text-xl text-teal-900">Save</Text>
      </Pressable>
      <StatusBar style="auto" />
    </View>
  );
}
