import { Text, View, Image, FlatList, ScrollView } from "react-native";
import React, {} from "react";
import { useGlobalContext } from "../../context/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import PhotoCards from "../../components/PhotoCards";
import InfoBox from "../../components/InfoBox";
import Trending from "../../components/Trending";

const Profile = () => {
  const { user } = useGlobalContext(); // Lấy thông tin người dùng từ context
  const userId = user ? user.$id : null; // Lưu userId

  const { data: posts = [], refetch } = useAppwrite(() => getUserPosts(userId));

  console.log("User ID:", userId); // Log userId để kiểm tra
  console.log("Fetched Posts:", posts); // Log bài viết để kiểm tra

  return (
    <View className="h-full py-20 flex items-center">
      {user ? (
        <SafeAreaView className="flex-col items-center mt-3">
          <InfoBox user={user} />

          {posts.length > 0 ? (
            <FlatList
              data={posts}
              keyExtractor={(item) => item.$id}
              renderItem={({ item }) => <Trending posts={posts} />}
            />
          ) : (
            <Text>No posts available</Text> // Thông báo không có bài đăng
          )}
        </SafeAreaView>
      ) : (
        <Text className="text-xl mt-4">Loading user...</Text>
      )}
    </View>
  );
};

export default Profile;
