import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import React from "react";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      className={`bg-black min-h-[62px] justify-center items-center ${isLoading ? 'opacity-50' : ''} ${containerStyles}`}
      disabled={isLoading}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className={`font-bold text-base ${textStyles}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
