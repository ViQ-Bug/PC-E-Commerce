import SafeScreen from "@/components/SafeScreen";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";
import { formatCurrency } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function WishlistScreen() {
  const {
    wishlist,
    isLoading,
    isError,
    removeFromWishlist,
    isRemovingFromWishlist,
  } = useWishlist();

  const { addToCart, isAddingToCart } = useCart();
  const handleRemoveFromWishlist = (productId: string, productName: string) => {
    Alert.alert(
      "Xóa mặt hàng khỏi danh sách yêu thích",
      `Đã xóa ${productName}`,
      [
        { text: "Huỷ", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => removeFromWishlist(productId),
        },
      ],
    );
  };
  const handleAddToCart = (productId: string, productName: string) => {
    addToCart(
      {
        productId,
        quantity: 1,
      },
      {
        onSuccess: () =>
          Alert.alert("Thành công thêm", `${productName} vào giỏ hàng`),
        onError: (error: any) =>
          Alert.alert(
            "Lỗi",
            error?.response.data.error || "Lỗi khi thêm vào giỏ hàng",
          ),
      },
    );
  };

  if (isLoading) return <LoadingUI />;
  if (isError) return <ErrorUI />;

  return (
    <SafeScreen>
      {/* HEADER */}
      <View className="px-6 pb-5 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color="#000000" />
        </TouchableOpacity>
        <Text className="text-zinc-900 text-2xl font-bold">
          Danh sách yêu thích
        </Text>
        <Text className="text-text-secondary text-sm ml-auto">
          {wishlist.length} {wishlist.length === 1 ? "mặt hàng" : "mặt hàng"}
        </Text>
      </View>

      {wishlist.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="heart-outline" size={80} color="#666" />
          <Text className="text-zinc-900 font-semibold text-xl mt-4">
            Danh sách yêu thích của bạn còn trống
          </Text>
          <Text className="text-text-secondary text-center mt-2">
            Bắt đầu thêm mặt hàng về danh sách yêu thích của bản
          </Text>
          <TouchableOpacity
            className="bg-[#5E81AC] rounded-2xl px-8 py-4 mt-6"
            activeOpacity={0.8}
            onPress={() => router.push("/(tabs)")}
          >
            <Text className="text-background font-bold text-base">
              Tìm kiếm
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="px-6 py-4">
            {wishlist.map((item) => (
              <TouchableOpacity
                key={item._id}
                className="bg-slate-300 rounded-3xl overflow-hidden mb-3"
                activeOpacity={0.8}
                // onPress={() => router.push(`/product/${item._id}`)}
              >
                <View className="flex-row p-4">
                  <Image
                    source={item.images[0]}
                    className="rounded-2xl bg-background-lighter"
                    style={{ width: 96, height: 96, borderRadius: 8 }}
                  />
                  <View className="flex-1 ml-4">
                    <Text
                      className="text-zinc-900 font-bold text-base mb-2"
                      numberOfLines={2}
                    >
                      {item.name}
                    </Text>
                    <Text
                      className="text-[#5E81AC] font-bold text-base mb-2"
                      numberOfLines={2}
                    >
                      {formatCurrency(item.price)}
                    </Text>
                    {item.stock > 0 ? (
                      <View className="flex-row items-center">
                        <View className="w-2 h-2 bg-[#5E81AC] rounded-full mr-2" />
                        <Text className="text-[#5E81AC] text-sm font-semibold">
                          {item.stock} tồn kho
                        </Text>
                      </View>
                    ) : (
                      <View className="flex-row items-center">
                        <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                        <Text className="text-red-500 text-sm font-semibold">
                          hết hàng
                        </Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity
                    className="self-start bg-red-500/20 p-2 rounded-full"
                    activeOpacity={0.7}
                    onPress={() =>
                      handleRemoveFromWishlist(item._id, item.name)
                    }
                    disabled={isRemovingFromWishlist}
                  >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>

                {item.stock > 0 && (
                  <View className="px-4 pb-4">
                    <TouchableOpacity
                      className="bg-[#5E81AC] rounded-xl py-3 items-center"
                      activeOpacity={0.8}
                      onPress={() => handleAddToCart(item._id, item.name)}
                      disabled={isAddingToCart}
                    >
                      {isAddingToCart ? (
                        <ActivityIndicator size="small" color="#121212" />
                      ) : (
                        <Text className="text-background font-bold">
                          Thêm vào giỏ hàng
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeScreen>
  );
}

export default WishlistScreen;

function LoadingUI() {
  return (
    <SafeScreen>
      <View className="px-6 pb-5 border-b border-surface flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-zinc-900 text-2xl font-bold">
          Danh sách yêu thích
        </Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#00D9FF" />
        <Text className="text-text-secondary mt-4">
          Đang tải danh sách yêu thích...
        </Text>
      </View>
    </SafeScreen>
  );
}

function ErrorUI() {
  return (
    <SafeScreen>
      <View className="px-6 pb-5 border-b border-surface flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text className="text-zinc-900 text-2xl font-bold">
          Danh sách yêu thích
        </Text>
      </View>
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
        <Text className="text-zinc-900 font-semibold text-xl mt-4">
          Không thể tải danh sách yêu thích
        </Text>
        <Text className="text-text-secondary text-center mt-2">
          Vui lòng kiểm tra kết nối và thử lại.
        </Text>
      </View>
    </SafeScreen>
  );
}
