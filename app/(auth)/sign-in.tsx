import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const SignIn = () => {
  const { signIn } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getErrorMessage = (error: any, fallback: string) => {
    return (
      error?.errors?.[0]?.longMessage ||
      error?.errors?.[0]?.message ||
      error?.message ||
      fallback
    );
  };

  const onSignInPress = async () => {
    if (!signIn) {
      Alert.alert("Please wait", "Clerk is still loading.");
      return;
    }

    if (!emailAddress.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please enter your email and password.");
      return;
    }

    try {
      setIsSubmitting(true);

      const signInAttempt = await signIn.password({
        emailAddress: emailAddress.trim(),
        password,
      });

      if (signInAttempt.error) {
        Alert.alert(
          "Sign In Failed",
          getErrorMessage(signInAttempt.error, "Unable to sign in."),
        );

        return;
      }

      await signIn.finalize();
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Sign In Failed", getErrorMessage(err, "Sign in failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const LogoHeader = () => (
    <View className="items-center mb-6">
      <View className="flex-row items-center">
        <View className="w-16 h-16 rounded-2xl bg-[#ea7a53] items-center justify-center mr-4">
          <Text className="text-white text-3xl font-sans-bold">R</Text>
        </View>

        <View>
          <Text className="text-4xl font-sans-bold text-[#081126]">
            Recurrly
          </Text>

          <Text className="text-xs font-sans-semibold tracking-[3px] text-[#081126]">
            SUBSCRIPTIONS
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#fff9e3]"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="flex-1 px-5 pt-20">
        <LogoHeader />

        <View className="items-center mb-8">
          <Text className="text-4xl font-sans-bold text-[#081126] mb-3 text-center">
            Welcome back
          </Text>

          <Text className="text-base text-gray-500 font-sans-medium text-center leading-6">
            Sign in to continue managing your subscriptions.
          </Text>
        </View>

        <View className="bg-white/60 rounded-3xl px-5 py-6 border border-gray-200">
          <Text className="text-sm font-sans-semibold text-[#081126] mb-2">
            Email Address
          </Text>

          <TextInput
            className="bg-white border border-gray-200 rounded-2xl px-5 py-4 mb-4 text-black font-sans-medium"
            placeholder="name@example.com"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            value={emailAddress}
            onChangeText={setEmailAddress}
          />

          <Text className="text-sm font-sans-semibold text-[#081126] mb-2">
            Password
          </Text>

          <TextInput
            className="bg-white border border-gray-200 rounded-2xl px-5 py-4 mb-3 text-black font-sans-medium"
            placeholder="Enter your password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Link
            href="/(auth)/forgot-password"
            className="text-right mb-5 text-[#ea7a53] font-sans-semibold"
          >
            Forgot password?
          </Link>

          <Pressable
            onPress={onSignInPress}
            disabled={isSubmitting}
            className={`rounded-2xl py-4 items-center ${
              isSubmitting ? "bg-gray-400" : "bg-[#ea7a53]"
            }`}
          >
            <Text className="text-[#081126] font-sans-bold text-base">
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Text>
          </Pressable>
        </View>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-500 font-sans-medium">
            Don&apos;t have an account?{" "}
          </Text>

          <Link href="/(auth)/sign-up">
            <Text className="text-[#ea7a53] font-sans-semibold">
              Create Account
            </Text>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
