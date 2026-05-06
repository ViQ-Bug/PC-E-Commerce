import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo, useState } from "react";
import SafeScreen from "@/components/SafeScreen";
import { Ionicons } from "@expo/vector-icons";
import ProductGrid from "@/components/ProductGrid";
import useProducts from "@/hooks/useProducts";

const CATEGORIES = [
  { name: "All", icon: "grid-outline" as const },
  { name: "PC", image: require("@/assets/images/pc.png") },
  { name: "Laptop", image: require("@/assets/images/latop.png") },
  {
    name: "Linh kiện máy tính",
    image: require("@/assets/images/components.png"),
  },
  { name: "Màn hình", image: require("@/assets/images/monitor.png") },
  { name: "Phụ kiện", image: require("@/assets/images/phukien.png") },
];

const ShopScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { data: products, isLoading, isError } = useProducts();
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory,
      );
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  }, [products, searchQuery, selectedCategory]);

  return (
    <SafeScreen>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View className="px-6 pb-4 pt-6">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-background-light text-3xl font-bold tractking-tight">
                Cửa hàng
              </Text>
              <Text className="text-text-secondary text-sm mt-1">
                Tìm kiếm tất cả sản phẩm
              </Text>
            </View>
            <TouchableOpacity
              className="bg-surface/50 p-3 rounded-full"
              activeOpacity={0.7}
            >
              <Ionicons name="options-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* SEARCH BAR */}
          <View className="bg-[#a0a1a3] flex-row items-center px-5 py-4 rounded-2xl">
            <Ionicons color={"#666"} size={22} name="search" />
            <TextInput
              placeholder="Tìm kiếm"
              placeholderTextColor={"#666"}
              className="flex-1 ml-3 text-base text-text-primary"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/*CATEGORY */}
        <View className="mb-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {CATEGORIES.map((category) => {
              const isSelected = category.name === selectedCategory;
              return (
                <TouchableOpacity
                  key={category.name}
                  onPress={() => setSelectedCategory(category.name)}
                  className={`mr-3 rounded-2xl size-20 overflow-hidden items-center justify-center ${isSelected ? " bg-[#5E81AC]" : "bg-slate-50"}`}
                >
                  {category.icon ? (
                    <Ionicons
                      name={category.icon}
                      size={36}
                      color={isSelected ? "#121212" : "#666"}
                    />
                  ) : (
                    <Image
                      source={category.image}
                      className="size-12"
                      resizeMode="contain"
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-neutral-900 text-lg font-bold">Sản phẩm</Text>
            <Text className="text-text-secondary text-sm">
              {filteredProducts.length} sản phẩm
            </Text>
          </View>
          {/* PRODUCT LIST */}
          <ProductGrid
            products={filteredProducts}
            isLoading={isLoading}
            isError={isError}
          />
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

export default ShopScreen;
