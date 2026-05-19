import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import SafeScreen from "@/components/SafeScreen";
import useCart from "@/hooks/useCart";
import { useAddresses } from "@/hooks/useAdresses";
import { useStripe } from "@stripe/stripe-react-native";
import { useApi } from "@/lib/api";
import { Address } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { formatCurrency } from "@/lib/utils";
import OrderSummary from "@/components/OrderSummary";
import AddressSelectionModal from "@/components/AddressSelectionModal";
import * as WebBrowser from "expo-web-browser";

const CartScreen = () => {
  const api = useApi();

  const {
    cart,
    cartItemCount,
    cartTotal,
    clearCart,
    isError,
    isLoading,
    isRemoving,
    isUpdating,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const { addresses } = useAddresses();

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [paymentLoading, setPaymentLoading] = useState(false);

  const [addressModalVisible, setAddressModalVisible] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "payos">(
    "stripe",
  );

  const cartItems = cart?.items || [];

  const subtotal = cartTotal;

  const shipping = 10;

  const tax = 0.08;

  const total = subtotal + shipping + tax;

  const handleQuantityChange = (
    productId: string,
    quantity: number,
    change: number,
  ) => {
    const newQuantity = quantity + change;

    if (newQuantity < 1) return;

    updateQuantity({
      productId,
      quantity: newQuantity,
    });
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    Alert.alert(
      "Xóa mặt hàng",
      `Đã xóa ${productName}`,
      [
        {
          text: "Huỷ",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => removeFromCart(productId),
        },
      ],
      { cancelable: false },
    );
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    if (!addresses || addresses.length === 0) {
      Alert.alert("Không có địa chỉ nào", "Vui lòng thêm địa chỉ giao hàng");

      return;
    }

    setAddressModalVisible(true);
  };

  const handleStripePayment = async (selectedAddress: Address) => {
    const { data } = await api.post("/payment/create-intent", {
      cartItems,
      shippingAddress: {
        fullName: selectedAddress.fullName,
        streetAddress: selectedAddress.streetAddress,
        city: selectedAddress.city,
        phoneNumber: selectedAddress.phoneNumber,
      },
    });

    const { error: initError } = await initPaymentSheet({
      paymentIntentClientSecret: data.clientSecret,

      merchantDisplayName: "admin",

      returnURL: "myapp://stripe-redirect",
    });

    if (initError) {
      Alert.alert("Stripe Error", initError.message);

      return;
    }

    const { error: presentError } = await presentPaymentSheet();

    if (presentError) {
      Alert.alert("Huỷ thanh toán", "Thanh toán đã bị huỷ");

      return;
    }

    Alert.alert("Thành công", "Thanh toán thành công");

    clearCart();
  };

  const handlePayOSPayment = async (selectedAddress: Address) => {
    const { data } = await api.post("/payment/create-payos", {
      cartItems,
      shippingAddress: {
        fullName: selectedAddress.fullName,
        streetAddress: selectedAddress.streetAddress,
        city: selectedAddress.city,
        phoneNumber: selectedAddress.phoneNumber,
      },
    });

    await WebBrowser.openBrowserAsync(data.checkoutUrl);

    Alert.alert("Đang xử lý", "Sau khi thanh toán hãy quay lại app");
  };

  const handleProceeWithPayment = async (selectedAddress: Address) => {
    setAddressModalVisible(false);

    try {
      setPaymentLoading(true);

      if (paymentMethod === "stripe") {
        await handleStripePayment(selectedAddress);
      } else {
        await handlePayOSPayment(selectedAddress);
      }
    } catch (error) {
      console.log("Payment failed", error);

      Alert.alert("Lỗi", "Lỗi khi thanh toán");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (isLoading) return <LoadingUI />;

  if (isError) return <ErrorUI />;

  if (cartItems.length === 0) return <EmptyUI />;

  return (
    <SafeScreen>
      <Text className="px-6 pb-5 text-neutral-900 text-3xl font-bold tracking-tight">
        Giỏ hàng
      </Text>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 240,
        }}
      >
        <View className="px-6 gap-3">
          {cartItems.map((item) => (
            <View
              key={item._id}
              className="bg-slate-300 rounded-3xl overflow-hidden"
            >
              <View className="p-4 flex-row">
                <View className="relative">
                  <Image
                    source={{
                      uri: item.product.images[0],
                    }}
                    className="bg-background-light"
                    contentFit="cover"
                    style={{
                      width: 112,
                      height: 112,
                      borderRadius: 16,
                    }}
                  />

                  <View className="absolute top-2 right-2 bg-[#5E81AC] rounded-full px-2 py-0.5">
                    <Text className="text-background text-xs font-bold">
                      {item.quantity}
                    </Text>
                  </View>
                </View>

                <View className="flex-1 ml-4 justify-center">
                  <View>
                    <Text
                      className="text-text-primary font-bold text-lg leading-tight"
                      numberOfLines={2}
                    >
                      {item.product.name}
                    </Text>

                    <View className="flex-col justify-center mt-2">
                      <Text className="text-[#5E81AC] items-center text-2xl">
                        {formatCurrency(item.product.price * item.quantity)}
                      </Text>

                      <Text className="text-text-secondary text-sm ml-2">
                        {formatCurrency(item.product.price)} mỗi sản phẩm
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center mt-3">
                    <TouchableOpacity
                      className="bg-background-lighter rounded-full w-9 h-9 items-center justify-center"
                      activeOpacity={0.7}
                      onPress={() =>
                        handleQuantityChange(
                          item.product._id,
                          item.quantity,
                          -1,
                        )
                      }
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Ionicons name="remove" size={18} color="#FFFFFF" />
                      )}
                    </TouchableOpacity>

                    <View className="mx-4 min-w-[32px] items-center">
                      <Text className="text-text-primary font-bold text-lg">
                        {item.quantity}
                      </Text>
                    </View>

                    <TouchableOpacity
                      className="bg-[#5E81AC] rounded-full w-9 h-9 items-center justify-center"
                      activeOpacity={0.7}
                      onPress={() =>
                        handleQuantityChange(item.product._id, item.quantity, 1)
                      }
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <ActivityIndicator size="small" color="#121212" />
                      ) : (
                        <Ionicons name="add" size={18} color="#121212" />
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="ml-auto bg-red-500/10 rounded-full w-9 h-9 items-center justify-center"
                      activeOpacity={0.7}
                      onPress={() =>
                        handleRemoveItem(item.product._id, item.product.name)
                      }
                      disabled={isRemoving}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#EF4444"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        <OrderSummary
          subtotal={subtotal}
          shipping={shipping}
          tax={tax}
          total={total}
        />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-background/95 border-t border-surface pt-4 pb-32 px-6">
        {/* PAYMENT METHOD */}

        <View className="flex-row gap-3 mb-4">
          <TouchableOpacity
            onPress={() => setPaymentMethod("stripe")}
            className={`flex-1 rounded-2xl p-4 ${
              paymentMethod === "stripe" ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <Text className="text-center text-white font-bold">Stripe</Text>

            <Text className="text-center text-white text-xs mt-1">
              Visa / Mastercard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setPaymentMethod("payos")}
            className={`flex-1 rounded-2xl p-4 ${
              paymentMethod === "payos" ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <Text className="text-center text-white font-bold">PayOS</Text>

            <Text className="text-center text-white text-xs mt-1">
              QR / Banking
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Ionicons name="cart" size={20} color="#5E81AC" />

            <Text className="text-text-secondary ml-2">
              {cartItemCount} sản phẩm
            </Text>
          </View>

          <View className="flex-row items-center">
            <Text className="text-text-primary font-bold text-xl">
              {formatCurrency(total)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className="bg-[#5E81AC] rounded-2xl overflow-hidden"
          activeOpacity={0.9}
          onPress={handleCheckout}
          disabled={paymentLoading}
        >
          <View className="py-5 flex-row items-center justify-center">
            {paymentLoading ? (
              <ActivityIndicator size="small" color="#121212" />
            ) : (
              <>
                <Text className="text-background font-bold text-lg mr-2">
                  Thanh toán
                </Text>

                <Ionicons name="arrow-forward" size={20} color="#121212" />
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <AddressSelectionModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        onProceed={handleProceeWithPayment}
        isProcessing={paymentLoading}
      />
    </SafeScreen>
  );
};

export default CartScreen;

function LoadingUI() {
  return (
    <View className="flex-1 bg-background items-center justify-center">
      <ActivityIndicator size="large" color="#00D9FF" />

      <Text className="text-text-secondary mt-4">Đang tải giỏ hàng...</Text>
    </View>
  );
}

function ErrorUI() {
  return (
    <View className="flex-1 bg-background items-center justify-center px-6">
      <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />

      <Text className="text-text-primary font-semibold text-xl mt-4">
        Không thể tải giỏ hàng
      </Text>

      <Text className="text-text-secondary text-center mt-2">
        Vui lòng kiểm tra kết nối và thử lại.
      </Text>
    </View>
  );
}

function EmptyUI() {
  return (
    <View className="flex-1 bg-slate-50">
      <View className="px-6 pt-16 pb-5">
        <Text className="text-neutral-900 text-3xl font-bold tracking-tight">
          Giỏ hàng
        </Text>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="cart-outline" size={80} color="#666" />

        <Text className="text-neutral-900 font-semibold text-xl mt-4">
          Giỏ hàng của bạn đang trống
        </Text>

        <Text className="text-text-secondary text-center mt-2">
          Thêm một số sản phẩm để bắt đầu
        </Text>
      </View>
    </View>
  );
}
