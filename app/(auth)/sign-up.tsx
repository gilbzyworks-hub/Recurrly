import { useSignUp } from "@clerk/expo";
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

const SignUp = () => {
  const { signUp } = useSignUp();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getErrorMessage = (error: any, fallback: string) => {
    return (
      error?.errors?.[0]?.longMessage ||
      error?.errors?.[0]?.message ||
      error?.message ||
      fallback
    );
  };

  const onSignUpPress = async () => {
    if (!signUp) {
      Alert.alert("Please wait", "Clerk is still loading.");
      return;
    }

    if (!firstName.trim() || !emailAddress.trim() || !password.trim()) {
      Alert.alert(
        "Missing fields",
        "Please enter your first name, email, and password.",
      );
      return;
    }

    if (password.length < 8) {
      Alert.alert("Weak password", "Password must be at least 8 characters.");
      return;
    }

    try {
      setIsSubmitting(true);

      const signUpAttempt = await signUp.create({
        firstName: firstName.trim(),
        emailAddress: emailAddress.trim(),
        password,
      });

      if (signUpAttempt.error) {
        Alert.alert(
          "Create Account Failed",
          getErrorMessage(signUpAttempt.error, "Unable to create account."),
        );

        return;
      }

      await signUp.verifications.sendEmailCode();
      setPendingVerification(true);
    } catch (err: any) {
      Alert.alert(
        "Create Account Failed",
        getErrorMessage(err, "Sign up failed"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onVerifyPress = async () => {
    if (!signUp) {
      Alert.alert("Please wait", "Clerk is still loading.");
      return;
    }

    if (!code.trim()) {
      Alert.alert("Missing code", "Please enter the verification code.");
      return;
    }

    try {
      setIsSubmitting(true);

      const verifyAttempt = await signUp.verifications.verifyEmailCode({
        code: code.trim(),
      });

      if (verifyAttempt.error) {
        Alert.alert(
          "Verification Failed",
          getErrorMessage(verifyAttempt.error, "Verification failed."),
        );

        return;
      }

      await signUp.finalize();
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert(
        "Verification Failed",
        getErrorMessage(err, "Verification failed"),
      );
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

  if (pendingVerification) {
    return (
      <KeyboardAvoidingView
        className="flex-1 bg-[#fff9e3]"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 px-5 pt-24">
          <LogoHeader />

          <View className="items-center mb-8">
            <Text className="text-4xl font-sans-bold text-[#081126] mb-3">
              Verify email
            </Text>

            <Text className="text-base text-gray-500 font-sans-medium text-center">
              Enter the verification code sent to your email.
            </Text>
          </View>

          <View className="bg-white/60 rounded-3xl px-5 py-6 border border-gray-200">
            <Text className="text-sm font-sans-semibold text-[#081126] mb-2">
              Verification Code
            </Text>

            <TextInput
              className="bg-white border border-gray-200 rounded-2xl px-5 py-5 mb-6 text-black font-sans-medium"
              placeholder="Enter code"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
            />

            <Pressable
              onPress={onVerifyPress}
              disabled={isSubmitting}
              className={`rounded-2xl py-5 items-center ${
                isSubmitting ? "bg-gray-400" : "bg-[#ea7a53]"
              }`}
            >
              <Text className="text-[#081126] font-sans-bold text-base">
                {isSubmitting ? "Verifying..." : "Verify Email"}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#fff9e3]"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="flex-1 px-5 pt-16">
        <LogoHeader />

        <View className="items-center mb-7">
          <Text className="text-4xl font-sans-bold text-[#081126] mb-3 text-center">
            Create your account
          </Text>

          <Text className="text-base text-gray-500 font-sans-medium text-center leading-6">
            Start tracking your subscriptions and never miss a payment.
          </Text>
        </View>

        <View className="bg-white/60 rounded-3xl px-5 py-6 border border-gray-200">
          <Text className="text-sm font-sans-semibold text-[#081126] mb-2">
            First Name
          </Text>

          <TextInput
            className="bg-white border border-gray-200 rounded-2xl px-5 py-4 mb-4 text-black font-sans-medium"
            placeholder="Enter your first name"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="words"
            autoCorrect={false}
            value={firstName}
            onChangeText={setFirstName}
          />

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
            className="bg-white border border-gray-200 rounded-2xl px-5 py-4 mb-2 text-black font-sans-medium"
            placeholder="Create a strong password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text className="text-gray-500 text-sm font-sans-medium mb-5">
            Minimum 8 characters required.
          </Text>

          <Pressable
            onPress={onSignUpPress}
            disabled={isSubmitting}
            className={`rounded-2xl py-4 items-center ${
              isSubmitting ? "bg-gray-400" : "bg-[#ea7a53]"
            }`}
          >
            <Text className="text-[#081126] font-sans-bold text-base">
              {isSubmitting ? "Creating..." : "Create Account"}
            </Text>
          </Pressable>
        </View>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-500 font-sans-medium">
            Already have an account?{" "}
          </Text>

          <Link href="/(auth)/sign-in">
            <Text className="text-[#ea7a53] font-sans-semibold">Sign In</Text>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
