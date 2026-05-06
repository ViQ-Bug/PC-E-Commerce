import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function AddressesHeader() {
  return (
    <View className="px-6 pb-5 flex-row items-center">
      <TouchableOpacity onPress={() => router.back()} className="mr-4">
        <Ionicons name="arrow-back" size={28} color="#000000" />
      </TouchableOpacity>
      <Text className="text-zinc-900 text-2xl font-bold">Địa chỉ của tôi</Text>
    </View>
  );
}
