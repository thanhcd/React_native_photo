import React, { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView, ScrollView, View, Text, Image } from "react-native";
import PhotoCards from "../../components/PhotoCards";
import CustomButton from "../../components/CustomButton";
import { useGlobalContext } from "../../context/GlobalProvider";
import { createChannel, connectUser, getClient } from "../../lib/streamchat"; // Import connectUser từ file lib

const UserProfile = () => {
  const router = useRouter();
  const { userId, username, avatar, email } = useLocalSearchParams();
  const { user } = useGlobalContext(); // Lấy user đăng nhập từ context

  const handleMessagePress = async () => {
    try {
      const client = getClient()
      const userToken = client.devToken(userId)
      await connectUser(userId, username, avatar, userToken); 
      console.log("kết nối thành công")
    } catch (error) {
      console.error("Error creating channel:", error);
    }
  };

  // Kiểm tra dữ liệu người dùng cần thiết
  if (!userId || !username || !avatar || !email) {
    return (
      <SafeAreaView className="h-full my-4">
        <Text className="text-xl mt-4">User information is missing...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="h-full pt-10 px-4">
      <View className="items-center w-full">
        <View className="w-[100px] h-[100px] rounded-full p-0.5">
          <Image
            source={{ uri: avatar }}
            className="w-full h-full rounded-full"
            resizeMode="cover"
          />
        </View>
        <Text className="text-4xl text-black font-cbold mt-8">{username}</Text>
        <Text className="text-xl mt-2 text-center">{email.split("@")[0]}@</Text>
      </View>
      <View className="min-h-[30vh] mt-8">
        <View className="justify-center w-full">
          <CustomButton
            title={`FOLLOW ${username}`}
            handlePress={() => {}}
            containerStyles="w-full h-[50px] bg-black rounded-lg mb-4"
            textStyles="text-white"
          />
          <CustomButton
            title="MESSAGE"
            handlePress={handleMessagePress} // Thêm hàm xử lý khi nhấn nút
            containerStyles="w-full h-[50px] border-2 border-grey bg-white rounded-lg"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UserProfile;
