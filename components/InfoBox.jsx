import { View, Text, Image } from "react-native";
import React from "react";

const InfoBox = ({ user }) => { // Destructure user từ props
  return (
    <View className="flex-1 items-center">
      <View className="w-[100px] h-[100px] rounded-full justify-center items-center p-0.5">
        <Image
          source={{ uri: user.avatar }}
          className="w-full h-full rounded-full"
          resizeMode="cover"
        />
      </View>
      <Text className="text-4xl text-black font-cbold mt-8">
        {user.username}
      </Text>
      <Text className="text-xl mt-4 text-center">
        {user.email.split("@")[0]}@
      </Text>
      <Text>Follow</Text>
    </View>
  );
};

export default InfoBox;
