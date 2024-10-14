import { View, ScrollView, Image, TouchableOpacity, Modal, Text } from "react-native";
import React, { useState } from "react";
import CustomButton from "./CustomButton";
import { icons } from "../constants";

const PhotoCards = ({ posts }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);

  const handleShowMore = () => {
    setVisibleCount((prevCount) => {
      const newCount = prevCount + 6;
      // Kiểm tra giá trị và in ra console để kiểm tra
      // console.log(`visibleCount: ${newCount}, posts.length: ${posts.length}`);
      return newCount > posts.length ? posts.length : newCount; // Đảm bảo không vượt quá số lượng ảnh
    });
  };

  return (
    <>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View className="flex-row flex-wrap justify-between">
          {posts.slice(0, visibleCount).map((post, index) => (
            <TouchableOpacity
              key={index}
              className="w-[48%] my-2"
              onPress={() => setSelectedImage(post)}
            >
              <Image
                source={{ uri: post.thumbnail }}
                className="w-full h-[180px]"
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>

        {visibleCount < posts.length && (
          <CustomButton
            title="SHOW MORE"
            handlePress={handleShowMore}
            containerStyles="w-full mt-7 border-2 border-grey bg-white rounded-lg"
          />
        )}
      </ScrollView>

      {selectedImage && (
        <Modal
          visible={!!selectedImage}
          transparent={true}
          onRequestClose={() => setSelectedImage(null)}
        >
          <View className="flex-1 justify-center items-center bg-black">
            <Image
              source={{ uri: selectedImage.thumbnail }}
              className="w-full h-full"
              resizeMode="contain"
            />
            <View className="absolute top-10 left-5 right-5 flex-row items-start justify-between">
              <View className="flex-row items-center">
                <Image
                  source={{ uri: selectedImage.creator.avatar }}
                  className="w-[40px] h-[40px] rounded-full"
                  resizeMode="cover"
                />
                <View className="flex-col px-2 py-1">
                  <Text className="font-bold text-white">
                    {selectedImage.creator.username}
                  </Text>
                  <Text className="w-full break-words text-white">
                    {selectedImage.creator.email.split("@")[0]}@
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                className="absolute right-4 top-4"
                onPress={() => setSelectedImage(null)}
              >
                <Image source={icons.x} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

export default PhotoCards;
