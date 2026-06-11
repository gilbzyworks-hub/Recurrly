import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

export default function ForgotPassword() {
  const { signIn } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [pendingReset, setPendingReset] = useState(false);
  const [needsNewPassword, setNeedsNewPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getErrorMessage = (error: any, fallback: string) => {
    return (
      error?.errors?.[0]?.longMessage ||
      error?.errors?.[0]?.message ||
      error?.message ||
      fallback
    );
  };

  const onRequestResetPress = async () => {
    if (!signIn) {
      Alert.alert("Please wait", "Clerk is still loading.");
      return;
    }

    if (!emailAddress.trim()) {
      Alert.alert("Missing email", "Please enter your email address.");
      return;
    }

    try {
      setIsSubmitting(true);

      const createAttempt = await signIn.create({
        identifier: emailAddress.trim(),
      });

      if (createAttempt.error) {
        Alert.alert(
          "Reset Failed",
          getErrorMessage(
            createAttempt.error,
            "Unable to start password reset.",
          ),
        );

        return;
      }

      const sendCodeAttempt = await signIn.resetPasswordEmailCode.sendCode();

      if (sendCodeAttempt.error) {
        Alert.alert(
          "Reset Failed",
          getErrorMessage(sendCodeAttempt.error, "Unable to send reset code."),
        );

        return;
      }

      setPendingReset(true);
    } catch (err: any) {
      Alert.alert(
        "Reset Failed",
        getErrorMessage(err, "Unable to send reset code."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onVerifyCodePress = async () => {
    if (!signIn) {
      Alert.alert("Please wait", "Clerk is still loading.");
      return;
    }

    if (!code.trim()) {
      Alert.alert("Missing code", "Please enter the verification code.");
      return;
    }

    try {
      setIsSubmitting(true);

      const verifyAttempt = await signIn.resetPasswordEmailCode.verifyCode({
        code: code.trim(),
      });

      if (verifyAttempt.error) {
        Alert.alert(
          "Verification Failed",
          getErrorMessage(
            verifyAttempt.error,
            "Invalid or expired reset code.",
          ),
        );

        return;
      }

      setNeedsNewPassword(true);
    } catch (err: any) {
      Alert.alert(
        "Verification Failed",
        getErrorMessage(err, "Invalid or expired reset code."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitNewPasswordPress = async () => {
    if (!signIn) {
      Alert.alert("Please wait", "Clerk is still loading.");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Missing password", "Please enter your new password.");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Weak password", "Password must be at least 8 characters.");
      return;
    }

    try {
      setIsSubmitting(true);

      const passwordAttempt =
        await signIn.resetPasswordEmailCode.submitPassword({
          password,
          signOutOfOtherSessions: true,
        });

      if (passwordAttempt.error) {
        Alert.alert(
          "Reset Failed",
          getErrorMessage(passwordAttempt.error, "Unable to reset password."),
        );

        return;
      }

      await signIn.finalize();

      Alert.alert("Password Updated", "You are now signed in.");
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert(
        "Reset Failed",
        getErrorMessage(err, "Unable to reset password."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (needsNewPassword) {
    return (
      <View className="flex-1 justify-center px-6 bg-background">
        <Text className="text-3xl font-sans-bold mb-3">
          Create new password
        </Text>

        <Text className="text-gray-500 font-sans-medium mb-8">
          Choose a new password for your Recurrly account.
        </Text>

        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-4 mb-2 font-sans-medium bg-white"
          placeholder="New password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text className="text-gray-500 text-sm font-sans-medium mb-6">
          Use at least 8 characters. Avoid common or previously leaked
          passwords.
        </Text>

        <Pressable
          onPress={onSubmitNewPasswordPress}
          disabled={isSubmitting}
          className={`rounded-xl py-4 items-center ${
            isSubmitting ? "bg-gray-400" : "bg-black"
          }`}
        >
          <Text className="text-white font-sans-semibold">
            {isSubmitting ? "Updating..." : "Update Password"}
          </Text>
        </Pressable>

        <Link href="/(auth)/sign-in" className="text-center mt-6">
          Back to Sign In
        </Link>
      </View>
    );
  }

  if (pendingReset) {
    return (
      <View className="flex-1 justify-center px-6 bg-background">
        <Text className="text-3xl font-sans-bold mb-3">Verify reset code</Text>

        <Text className="text-gray-500 font-sans-medium mb-8">
          Enter the code sent to your email.
        </Text>

        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-4 mb-6 font-sans-medium bg-white"
          placeholder="Verification code"
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
        />

        <Pressable
          onPress={onVerifyCodePress}
          disabled={isSubmitting}
          className={`rounded-xl py-4 items-center ${
            isSubmitting ? "bg-gray-400" : "bg-black"
          }`}
        >
          <Text className="text-white font-sans-semibold">
            {isSubmitting ? "Verifying..." : "Verify Code"}
          </Text>
        </Pressable>

        <Link href="/(auth)/sign-in" className="text-center mt-6">
          Back to Sign In
        </Link>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center px-6 bg-background">
      <Text className="text-3xl font-sans-bold mb-3">Forgot password?</Text>

      <Text className="text-gray-500 font-sans-medium mb-8">
        Enter your email and we&apos;ll send you a reset code.
      </Text>

      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-4 mb-6 font-sans-medium bg-white"
        placeholder="Email"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        value={emailAddress}
        onChangeText={setEmailAddress}
      />

      <Pressable
        onPress={onRequestResetPress}
        disabled={isSubmitting}
        className={`rounded-xl py-4 items-center ${
          isSubmitting ? "bg-gray-400" : "bg-black"
        }`}
      >
        <Text className="text-white font-sans-semibold">
          {isSubmitting ? "Sending..." : "Send Reset Code"}
        </Text>
      </Pressable>

      <Link href="/(auth)/sign-in" className="text-center mt-6">
        Back to Sign In
      </Link>
    </View>
  );
}
