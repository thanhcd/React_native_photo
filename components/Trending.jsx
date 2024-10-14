import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
  Modal,
} from "react-native";
import React, { useState } from "react";
import * as Animatable from "react-native-animatable";
import { icons } from "../constants";

const ZoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1.0,
  },
};
const ZoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

const TrendingItem = ({ activeItem, item, onPress }) => {
  const [selectedImage, setSelectedImage] = useState(false);

  return (
    <Animatable.View
      animation={activeItem === item.$id ? ZoomIn : ZoomOut}
      duration={500}
    >
      {selectedImage ? (
        // Khi play, hiển thị ảnh toàn màn hình và không bị cắt, cùng với thông tin người dùng
        <Modal
          visible={selectedImage}
          transparent={true}
          onRequestClose={() => setSelectedImage(false)}
        >
          <View className="flex-1 justify-center items-center bg-black">
            {/* Hiển thị ảnh full màn hình */}
            <Image
              source={{ uri: item.thumbnail }}
              className="w-full h-full"
              resizeMode="contain" // Hiển thị toàn bộ ảnh mà không bị cắt
            />

            {/* Hiển thị thông tin người dùng */}
            <View className="absolute top-10 left-5 right-5 flex-row items-start justify-between">
              <View className="flex-row items-center">
                <Image
                  source={{ uri: item.creator.avatar }} // Avatar của creator
                  className="w-[40px] h-[40px] rounded-full"
                  resizeMode="cover"
                />
                <View className="flex-col px-2 py-1">
                  <Text className="font-bold text-white">
                    {item.creator.username}
                  </Text>
                  <Text className="w-full break-words text-white">
                    {item.creator.email.split("@")[0]}@
                  </Text>
                </View>
              </View>

              {/* Di chuyển nút đóng sang bên phải với absolute */}
              <TouchableOpacity
                className="absolute right-1 top-0 z-10" // Đặt nút ở bên phải
                onPress={() => setSelectedImage(false)}
              >
                <Image source={icons.x} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setSelectedImage(true)} // Khi nhấn vào ảnh, mở chế độ toàn màn hình
        >
          {/* Hiển thị ảnh từ URL item.thumbnail */}
          <ImageBackground
            source={{ uri: item.thumbnail }} // URL của ảnh
            className="min-w-[43vh] min-h-[35vh] my-2 overflow-hidden"
            resizeMode="cover" // Căn chỉnh ảnh theo kích thước của ImageBackground
          ></ImageBackground>
        </TouchableOpacity>
      )}

      {/* Thông tin người dùng dưới ảnh */}
      <View className="flex-col items-center mt-3">
        <View className="flex-row items-start">
          <View className="flex-row flex-1">
            <View className="w-[46px] h-[46px] rounded-full justify-center items-center p-0.5">
              <Image
                source={{ uri: item.creator.avatar }} // URL của avatar
                className="w-full h-full rounded-full"
                resizeMode="cover"
              />
            </View>
            <View className="flex-col px-2 py-1">
              <Text className="font-bold">{item.creator.username}</Text>
              <Text className="w-full break-words">
                {item.creator.email.split("@")[0]}@
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Animatable.View>
  );
};

const Trending = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return <Text>No trending items available</Text>;
  }

  const [activeItem, setActiveItem] = useState(posts[1].$id);

  const viewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <TrendingItem activeItem={activeItem} item={item} />
        )}
        horizontal
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 70,
        }}
      />
    </>
  );
};

export default Trending;
