import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  Text,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import CustomButton from "./CustomButton";
import { icons } from "../constants";
import StaggeredList from "@mindinventory/react-native-stagger-view";
import { getUserInfo } from "../lib/appwrite";
import { router } from "expo-router";

const PhotoCards = ({ posts }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const isLoading = false; // Thay đổi này nếu bạn có logic tải

  // Tạo mảng imageURL từ posts
  const imageURL = posts.slice(0, visibleCount).map((post, index) => ({
    id: index, // Hoặc sử dụng `post.id` nếu có
    url: post.thumbnail,
  }));

  const handleShowMore = () => {
    setVisibleCount((prevCount) => {
      const newCount = prevCount + 6;
      return newCount > posts.length ? posts.length : newCount; // Đảm bảo không vượt quá số lượng ảnh
    });
  };

  const handleUserInfo = async (userId) => {
    if (!userId) {
      console.warn("User ID is not defined");
      return; // Trả về nếu không có ID
    }

    try {
      const userInfo = await getUserInfo(userId);
      console.log("User Info:", userInfo);
      // Thực hiện hành động với userInfo, như hiển thị trong modal hoặc navigation
    } catch (error) {
      console.error("Error fetching user info:", error.message);
    }
  };

  const renderChildren = (item) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={getChildrenStyle()}
        onPress={() => setSelectedImage(posts[item.id])} // Lưu ý để lấy post tương ứng
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
      width: "100%", // Sử dụng width 100% để đảm bảo chiếm hết không gian
      height: Math.random() * 100 + 200, // Chiều cao ngẫu nhiên trong khoảng 200 đến 300
      padding: 5,
    };
  };

  return (
    <>
      <View>
        <StaggeredList
          data={imageURL}
          animationType={"SLIDE_DOWN"}
          contentContainerStyle={{}} // Thêm padding nếu cần
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => renderChildren(item)}
          isLoading={isLoading}
          LoadingView={
            <View>
              <ActivityIndicator color={"black"} />
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
              {/* Kiểm tra selectedImage.creator trước khi gọi hàm getUserInfo */}
              {selectedImage.creator && (
                <TouchableOpacity
                  onPress={() => {
                    console.log(
                      "Calling handleUserInfo with ID:",
                      selectedImage.creator.username
                    );
                    handleUserInfo(selectedImage.creator.$id);

                    // Truyền thông tin người dùng tới UserProfile
                    router.push({
                      pathname: "chatmessage/UserProfile",
                      params: {
                        userId: selectedImage.creator.$id,
                        username: selectedImage.creator.username,
                        avatar: selectedImage.creator.avatar,
                        email: selectedImage.creator.email,
                      },
                    });
                  }}
                >
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
                </TouchableOpacity>
              )}

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
