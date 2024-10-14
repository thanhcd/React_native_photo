import { View, Image, TouchableOpacity, Modal, Text, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import CustomButton from "./CustomButton";
import { icons } from "../constants";
import StaggeredList from '@mindinventory/react-native-stagger-view';

const PhotoCards = ({ posts }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const isLoading = false; // Thay đổi này nếu bạn có logic tải

  // Tạo mảng imageURL từ posts
  const imageURL = posts.slice(0, visibleCount).map((post, index) => ({
    id: index, // hoặc sử dụng `post.id` nếu có
    url: post.thumbnail,
  }));

  const handleShowMore = () => {
    setVisibleCount((prevCount) => {
      const newCount = prevCount + 6;
      return newCount > posts.length ? posts.length : newCount; // Đảm bảo không vượt quá số lượng ảnh
    });
  };

  const renderChildren = (item) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={getChildrenStyle()}
        onPress={() => setSelectedImage(posts[item.id])} // Lưu ý để lấy post tương ứng\
        
      >
        <Image
          source={{ uri: item.url }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  };

  const getChildrenStyle = () => {
    return {
      width: '100%', // Sử dụng width 48% để có khoảng cách đều giữa các phần tử
      height: Math.random() * 100 + 200, // Chiều cao ngẫu nhiên trong khoảng 150 đến 250
      padding: 5
    };
  };

  return (
    <>
      <View>
        <StaggeredList
          data={imageURL}
          animationType={'SLIDE_DOWN'}
          contentContainerStyle={{}} // Thêm padding nếu cần
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => renderChildren(item)}
          isLoading={isLoading}
          LoadingView={
            <View>
              <ActivityIndicator color={'black'} />
            </View>
          }
        />
      </View>

      {visibleCount < posts.length && (
        <CustomButton
          title="SHOW MORE"
          handlePress={handleShowMore}
          containerStyles="w-full mt-7 border-2 border-grey bg-white rounded-lg"
        />
      )}

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
