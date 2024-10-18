import React, { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView, ScrollView, View, Text, Image } from "react-native";
import { getUserPosts } from "../../lib/appwrite"; // Hàm gọi API
import PhotoCards from "../../components/PhotoCards";
import CustomButton from "../../components/CustomButton";

const UserProfile = () => {
  const router = useRouter();
  const { userId, username, avatar, email } = useLocalSearchParams();
  const [posts, setPosts] = useState([]);

  console.log("User Id", userId);
  console.log("username", username);
  console.log("avatar", avatar);
  console.log("email", email);

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     if (userId) { // Kiểm tra userId có tồn tại trước khi gọi API
  //       try {
  //         const userPosts = await getUserPosts(userId);
  //         setPosts(userPosts);
  //         console.log(userPosts)
  //       } catch (error) {
  //         console.error("Error fetching posts:", error.message);
  //       }
  //     }
  //   };
  //   fetchPosts();
  // }, [userId]);

  // Kiểm tra nếu userId, username, avatar hoặc email không tồn tại
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
            handlePress={() => {
              router.push("/signup");
            }}
            containerStyles="w-full h-[50px] bg-black rounded-lg mb-4" // Thêm margin-bottom cho khoảng cách giữa các nút
            textStyles="text-white"
          />
          <CustomButton
            title="MESSAGE"
            handlePress={() => {
              router.push("/login");
            }}
            containerStyles="w-full h-[50px] border-2 border-grey bg-white rounded-lg"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UserProfile;
