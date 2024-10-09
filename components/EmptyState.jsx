import { View, Text, Image } from "react-native";
import React from "react";
import CustomButton from "./CustomButton";
import { images } from "../constants";
import { router } from "expo-router";

const EmptyState = () => {
  return (
    <View className="flex-1 justify-center items-center w-full ">
      <Image
        source={images.empty}
        className="w-[270px] h-[215px]"
        resizeMode="contain"  // Đổi sang contain để tránh hình bị cắt
      />
      <Text className="font-cbold mt-7 text-center" style={{ fontWeight: "bold" }}>
        No photo found
      </Text>
      <CustomButton
        title="Create One?"
        handlePress={() => router.push('/create')}
        containerStyles="w-full mt-5 border-2 border-grey bg-white rounded-lg"
      />
    </View>
  );
};

export default EmptyState;
