import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import { getAllPosts, getLatestPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import PhotoCards from "../../components/PhotoCards";

const Home = () => {
  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const [refreshing, setRefreshing] = useState(false);
  const { data: latestPost } = useAppwrite(getLatestPosts);
  console.log(posts)

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="h-full px-4 pt-10">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View>
          <Text className="text-4xl text-black font-cbold">Discover</Text>
          <Text className="font-cbold font-bold mt-7 mb-7">
            WHAT'S NEW TODAY
          </Text>
          <Trending posts={latestPost ?? []} />
        </View>
        <View className="mt-10">
          <Text className="font-bold mb-0">BROWSE ALL</Text>
          <PhotoCards posts={posts ?? []} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
