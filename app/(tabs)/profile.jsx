import {
  Text,
  View,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import React, { useState } from "react";
import { useGlobalContext } from "../../context/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserPosts, signOut } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import InfoBox from "../../components/InfoBox";
import Trending from "../../components/Trending";
import { icons } from "../../constants";
import { router } from "expo-router";
import ProfileCard from "../../components/ProfileCard";
import PhotoCards from "../../components/PhotoCards";

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext(); // Lấy thông tin người dùng từ context
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const { data: posts, refetch } = useAppwrite(() => getUserPosts(user.$id));
  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace("/login");
  };

  return (
    <SafeAreaView className="h-full my-4">
      <ScrollView showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
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
            <View className="px-4">
              <Text className="text-base">Your latest posts</Text>
              <ProfileCard posts={posts} />
            </View>
          </View>
        ) : (
          <Text className="text-xl mt-4">Loading user...</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
