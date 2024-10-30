import { View, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { icons } from "../constants";
import { useRouter } from "expo-router";

const SearchInput = ({ initialQuery, onSearch }) => {
  const [query, setQuery] = useState(initialQuery || ""); // Initialize with initialQuery
  const router = useRouter();

  useEffect(() => {
    setQuery(initialQuery || ""); // Update query if initialQuery changes
  }, [initialQuery]);

  const handleSearch = () => {
    if (!query) {
      return Alert.alert("Missing query", "Please input something to search");
    }
    // Instead of pushing, call the onSearch function passed as a prop
    onSearch(query);
  };

  return (
    <View
      className="border-2 border-black-100 focus:border-secondary items-center 
      w-full h-16 px-4 flex-row space-x-4 mt-7"
    >
      <TextInput
        className="text-base mt-0.5 flex-1 font-pregular"
        placeholder="Search for photo by title"
        value={query} // Bind the value to query
        onChangeText={(e) => setQuery(e)}
      />
      <TouchableOpacity onPress={handleSearch}>
        <Image
          source={icons.search2}
          className="w-6 h-6"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
