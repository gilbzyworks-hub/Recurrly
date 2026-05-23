import "@/global.css";
import { Text, View, Pressable } from "react-native";
import { Link } from "expo-router";

export default function App() {
    return (
        <View className="flex-1 items-center justify-center bg-background">
            <Text className="text-xl font-bold text-green-400">
                Welcome to Nativewind!
            </Text>

            <Link href="/onboarding" asChild>
                <Pressable className="mt-4 w-56 items-center rounded bg-slate-900 p-4">
                    <Text className="text-white">
                        Go to Onboarding
                    </Text>
                </Pressable>
            </Link>

            <Link href="/(auth)/sign-in" asChild>
                <Pressable className="mt-4 w-56 items-center rounded bg-slate-900 p-4">
                    <Text className="text-white">
                        Go to Sign In
                    </Text>
                </Pressable>
            </Link>

            <Link href="/(auth)/sign-up" asChild>
                <Pressable className="mt-4 w-56 items-center rounded bg-slate-900 p-4">
                    <Text className="text-white">
                        Go to Sign Up
                    </Text>
                </Pressable>
            </Link>

            <Link href="/subscriptions/spotify">
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
    );
}
