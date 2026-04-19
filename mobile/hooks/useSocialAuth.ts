import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert } from "react-native";
import * as Linking from "expo-linking";

function useSocialAuth() {
  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
  const { startSSOFlow } = useSSO();

  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
    try {
      setLoadingStrategy(strategy);

      const redirectUrl = Linking.createURL("sso-callback");

      const { createdSessionId, setActive, signIn } = await startSSOFlow({
        strategy,
        redirectUrl,
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      } else if (signIn?.createdSessionId && setActive) {
        await setActive({ session: signIn.createdSessionId });
      } else {
        console.log("⚠️ No session created");
      }
    } catch (error: any) {
      console.log("💥 Error in social auth:", error);

      const provider = strategy === "oauth_google" ? "Google" : "Apple";

      Alert.alert(
        "Error",
        `Đăng nhập bằng tài khoản ${provider} không thành công. Vui lòng thử lại.`,
      );
    } finally {
      setLoadingStrategy(null);
    }
  };

  return { loadingStrategy, handleSocialAuth };
}

export default useSocialAuth;
