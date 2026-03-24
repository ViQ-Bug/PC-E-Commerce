import useSocialAuth from "@/hooks/useSocialAuth";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

export default function AuthScreen() {
  const { isLoading, handleSocialAuth } = useSocialAuth();
  return (
    <View className="px-14 flex-1 justify-center items-center bg-white">
      <Image
        source={require("../../assets/images/auth-image.png")}
        className="size-96"
        resizeMode="contain"
      />
      <View className="gap-2 mt-3">
        {/* GOOGLE BUTTON */}
        <TouchableOpacity
          className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full px-6 py-2"
          onPress={() => handleSocialAuth("oauth_google")}
          disabled={isLoading}
          style={{
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            elevation: 2,
          }}
        >
          {isLoading ? (
            <ActivityIndicator size={"small"} color={"#4285f4"} />
          ) : (
            <View className="flex-row items-center justify-center">
              <Image
                source={require("../../assets/images/google.png")}
                className="size-10 mr-3"
                resizeMode="contain"
              />
              <Text className="text-black font-medium text-base">
                Tiếp tục với tài khoản Google
              </Text>
            </View>
          )}
        </TouchableOpacity>
        {/* APPLE BUTTON */}
        <TouchableOpacity
          className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full px-6 py-2"
          onPress={() => handleSocialAuth("oauth_apple")}
          disabled={isLoading}
          style={{
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            elevation: 2,
          }}
        >
          {isLoading ? (
            <ActivityIndicator size={"small"} color={"#4285f4"} />
          ) : (
            <View className="flex-row items-center justify-center">
              <Image
                source={require("../../assets/images/apple.png")}
                className="size-10 mr-3"
                resizeMode="contain"
              />
              <Text className="text-black font-medium text-base">
                Tiếp tục với tài khoản Apple
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <Text className="text-center text-gray-500 text-xs leading-4 mt-4 px-2">
        Bằng cách đăng ký, bạn đồng ý với{" "}
        <Text className="text-blue-500">Điều khoản, Chính sách bảo mật</Text> và
        việc sử dụng <Text className="text-blue-500">Cookie</Text> của chúng
        tôi.
      </Text>
    </View>
  );
}
