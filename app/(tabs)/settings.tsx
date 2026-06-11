import { useClerk, useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  const userName = user?.firstName || user?.fullName || "Recurrly User";

  const email = user?.emailAddresses?.[0]?.emailAddress || "No email";

  const joinedDate = user?.createdAt
    ? dayjs(user.createdAt).format("DD.MM.YYYY")
    : "--";

  const accountId = user?.id ? `${user.id.slice(0, 16)}...` : "--";

  return (
    <SafeAreaView className="flex-1 bg-[#fff9e3] px-7 pt-6">
      <Text className="text-5xl font-sans-bold text-[#081126] mb-12">
        Settings
      </Text>

      {/* Profile Card */}
      <View className="bg-white/70 border border-gray-200 rounded-3xl p-6 mb-6">
        <View className="flex-row items-center">
          {user?.imageUrl ? (
            <Image
              source={{ uri: user.imageUrl }}
              className="w-16 h-16 rounded-2xl mr-4"
            />
          ) : (
            <View className="w-16 h-16 rounded-2xl bg-[#ea7a53] items-center justify-center mr-4">
              <Text className="text-white text-2xl font-sans-bold">
                {userName.charAt(0)}
              </Text>
            </View>
          )}

          <View className="flex-1">
            <Text className="text-2xl font-sans-bold text-[#081126]">
              {userName}
            </Text>

            <Text className="text-base text-gray-500 font-sans-medium mt-1">
              {email}
            </Text>
          </View>
        </View>
      </View>

      {/* Account Card */}
      <View className="bg-white/70 border border-gray-200 rounded-3xl p-6 mb-8">
        <Text className="text-xl font-sans-bold text-[#081126] mb-6">
          Account
        </Text>

        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-gray-500 text-base font-sans-medium">
            Account ID
          </Text>

          <Text className="font-sans-semibold text-[#081126]">{accountId}</Text>
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-gray-500 text-base font-sans-medium">
            Joined
          </Text>

          <Text className="font-sans-semibold text-[#081126]">
            {joinedDate}
          </Text>
        </View>
      </View>

      {/* Sign Out */}
      <Pressable
        onPress={() => signOut()}
        className="bg-[#ea7a53] rounded-2xl py-5 items-center"
      >
        <Text className="text-[#081126] text-lg font-sans-bold">Sign Out</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Settings;
