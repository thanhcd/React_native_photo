import { View, Text, FlatList, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router"; // Use this to get query from URL
import SearchInput from "../../components/SearchInput";
import PhotoCards from "../../components/PhotoCards";
import { searchPosts } from "../../lib/appwrite"; // Assume this is your search function
import SearchCards from "../../components/SearchCards";
import EmptyState from "../../components/EmptyState";

const Search = () => {
  const { query: initialQuery } = useLocalSearchParams(); // Get the query from the URL
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (initialQuery) {
      // Fetch search results based on the query
      searchPosts(initialQuery).then(setPosts).catch(console.error);
    }
  }, [initialQuery]);

  const handleSearch = (query) => {
    // Fetch new posts based on the new query
    searchPosts(query).then(setPosts).catch(console.error);
  };

  return (
    //Đéo hiểu sao thằng lồn này lại là pt-16 trong khi mấy trang khác là pt-10
    <SafeAreaView className="h-full mx-4 pt-16">
      <Text className="text-4xl text-black font-cbold">Search</Text>
      <SearchInput initialQuery={initialQuery} onSearch={handleSearch} />
      <Text className="font-bold font-cregular mt-5">ALL RESULT</Text>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <SearchCards posts={[item]} />}
        ListEmptyComponent={() => <EmptyState />}
      />
    </SafeAreaView>
  );
};

export default Search;
