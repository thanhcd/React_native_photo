import { View, Text, Image } from "react-native";
import React from "react";

const InfoBox = ({ user }) => {
  if (!user) return <Text>Loading user info...</Text>; // Hoặc một thông báo thích hợp

  return (
    <View className="items-center w-full">
      <View className="w-[100px] h-[100px] rounded-full p-0.5">
        <Image
          source={{ uri: user?.avatar }}
          className="w-full h-full rounded-full"
          resizeMode="cover"
        />
      </View>
      <Text className="text-4xl text-black font-cbold mt-8">
        {user.username}
      </Text>
      <Text className="text-xl mt-2 text-center">
        {user.email.split("@")[0]}@
      </Text>
    </View>
  );
};

export default InfoBox;
