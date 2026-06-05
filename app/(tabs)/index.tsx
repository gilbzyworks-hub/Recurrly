import "@/global.css";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <View className="w-full max-w-sm self-center">
        <Text className="text-xl font-bold text-success">
          Welcome to Nativewind!
        </Text>

        <Link href="/onboarding" asChild>
          <Pressable className="mt-4 rounded bg-primary p-4">
            <Text className="text-white">Go to Onboarding</Text>
          </Pressable>
        </Link>

        <Link href="/(auth)/sign-in" asChild>
          <Pressable className="mt-4 rounded bg-primary p-4">
            <Text className="text-white">Go to Sign In</Text>
          </Pressable>
        </Link>

        <Link href="/(auth)/sign-up" asChild>
          <Pressable className="mt-4 rounded bg-primary p-4">
            <Text className="text-white">Go to Sign Up</Text>
          </Pressable>
        </Link>

        <Link href="/subscriptions/spotify" className="mt-2">
          Spotify Subscription
        </Link>

        <Link
          href={{
            pathname: "/subscriptions/[id]",
            params: { id: "claude" },
          }}
        >
          Claude Max Subscription
        </Link>
      </View>
    </SafeAreaView>
  );
}
