import {
  Text,
  View,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useGlobalContext } from "../../context/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserPosts, signOut } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import InfoBox from "../../components/InfoBox";
import Trending from "../../components/Trending";
import { icons } from "../../constants";
import { router } from "expo-router";

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext(); // Lấy thông tin người dùng từ context

  const { data: posts } = useAppwrite(() => getUserPosts(user.$id));
  console.log("duwxl iêu", posts)
  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace("/login");
  };

  return (
    <SafeAreaView className="h-full my-10">
      {user ? (
        <View className="mt-3">
          <TouchableOpacity
            className="w-full items-end mb-6 px-4"
            onPress={logout}
          >
            <Image
              source={icons.logout}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>

          <InfoBox user={user} />

          {posts.length > 0 ? (
            <FlatList
              data={posts}
              keyExtractor={(item) => item.$id}
              renderItem={({ item }) => <Trending posts={posts} />}
            />
          ) : (
            <Text className="text-center">No posts available</Text> // Thông báo không có bài đăng
          )}
        </View>
      ) : (
        <Text className="text-xl mt-4">Loading user...</Text>
      )}
    </SafeAreaView>
  );
};

export default Profile;
