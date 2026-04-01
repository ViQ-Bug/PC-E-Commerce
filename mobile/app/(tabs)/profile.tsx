import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import SafeScreen from "@/components/SafeScreen";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";

const MENU_ITEMS = [
  {
    id: 1,
    icon: "person-outline",
    title: "Thông tin",
    color: "#3B82F6",
    action: "/profile",
  },
  {
    id: 2,
    icon: "list-outline",
    title: "Đơn hàng",
    color: "#10B981",
    action: "/orders",
  },
  {
    id: 3,
    icon: "location-outline",
    title: "Địa chỉ",
    color: "#F59E0B",
    action: "/addresses",
  },
  {
    id: 4,
    icon: "heart-outline",
    title: "Yêu thích",
    color: "#EF4444",
    action: "/wishlist",
  },
] as const;

const ProfileScreen = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const handleMenuPress = (action: (typeof MENU_ITEMS)[number]["action"]) => {
    if (action === "/profile") return;
    router.push(action);
  };
  return (
    <SafeScreen>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* HEADER */}
        <View className="px-6 pb-8">
          <View className="bg-surface rounded-3xl p-6">
            <View className="flex-row items-center">
              <View className="relative">
                <Image
                  source={user?.imageUrl}
                  style={{ width: 80, height: 80, borderRadius: 40 }}
                  transition={200}
                />
                <View className="absolute -bottom-1 -right-1 bg-primary rounded-full size-7 items-center justify-center border-2 border-surface">
                  <Ionicons name="checkmark" size={16} color="#121212" />
                </View>
              </View>

              <View className="flex-1 ml-4">
                <Text className="text-text-primary text-2xl font-bold mb-1">
                  {user?.firstName} {user?.lastName}
                </Text>
                <Text className="text-text-secondary text-sm">
                  {user?.emailAddresses?.[0]?.emailAddress || "No email"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* MENU */}
        <View className="flex-row flex-wrap gap-2 mx-6 mb-3">
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="bg-surface rounded-2xl p-6 items-center justify-center"
              style={{ width: "48%" }}
              activeOpacity={0.7}
              onPress={() => handleMenuPress(item.action)}
            >
              <View
                className="rounded-full w-16 h-16 items-center justify-center mb-4"
                style={{ backgroundColor: item.color + "20" }}
              >
                <Ionicons name={item.icon} size={28} color={item.color} />
              </View>
              <Text className="text-text-primary font-bold text-base">
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* NOTIFICATIONS */}
        <View className="mb-3 mx-6 bg-surface rounded-2xl p-4">
          <TouchableOpacity
            className="flex-row items-center justify-between py-2"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#FFFFFF"
              />
              <Text className="text-text-primary font-semibold ml-3">
                Thông báo
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        {/* PRIVACY AND SECURTIY LINK */}
        <View className="mb-3 mx-6 bg-surface rounded-2xl p-4">
          <TouchableOpacity
            className="flex-row items-center justify-between py-2"
            activeOpacity={0.7}
            // onPress={() => router.push("/privacy-security")}
          >
            <View className="flex-row items-center">
              <Ionicons
                name="shield-checkmark-outline"
                size={22}
                color="#FFFFFF"
              />
              <Text className="text-text-primary font-semibold ml-3">
                Quyền riêng tư và bảo mật
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        {/* LOGOUT */}
        <TouchableOpacity
          className="mx-6 mb-3 bg-surface rounded-2xl py-5 flex-row items-center justify-center border-2 border-red-500/20"
          activeOpacity={0.8}
          onPress={() => signOut()}
        >
          <Ionicons name="log-out-outline" size={22} color="#EF4444">
            <Text>Đăng xuất</Text>
          </Ionicons>
        </TouchableOpacity>
        <Text className="mx-6 mb-3 text-center text-text-secondary text-xs">
          Phiên bản 1.0.0
        </Text>
      </ScrollView>
    </SafeScreen>
  );
};

export default ProfileScreen;
