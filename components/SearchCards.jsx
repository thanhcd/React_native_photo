import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Text,
} from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { getUserInfo } from "../lib/appwrite";

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

const SearchCards = ({ posts }) => {
  const [selectedImage, setSelectedImage] = useState(null); // Trạng thái để lưu ảnh đã chọn

  return (
    <SafeAreaView>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View className="flex-row">
          {posts.map((post, index) => (
            <TouchableOpacity
              key={index}
              className="w-[100%] " // Chiếm 33.33% chiều rộng và thêm padding cho các ảnh
              onPress={() => setSelectedImage(post)} // Khi nhấn vào ảnh, lưu ảnh đã chọn
            >
              <Image
                source={{ uri: post.thumbnail }}
                className="w-full h-[300px]" // Đặt chiều cao cố định cho ảnh
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {selectedImage && (
        <Modal
          visible={!!selectedImage}
          transparent={true}
          onRequestClose={() => setSelectedImage(null)} // Đóng modal khi nhấn nút quay lại
        >
          <View className="flex-1 justify-center items-center bg-black">
            <Image
              source={{ uri: selectedImage.thumbnail }}
              className="w-full h-full"
              resizeMode="contain" // Hiển thị ảnh mà không bị cắt
            />
            <View className="absolute top-10 left-5 right-5 flex-row items-start justify-between">
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
                    source={{ uri: selectedImage.creator.avatar }} // Avatar của creator
                    className="w-[40px] h-[40px] rounded-full"
                    resizeMode="cover"
                  />
                  <View className="flex-col px-2 py-1">
                    <Text className="font-bold text-white">
                      {selectedImage.creator.username}{" "}
                      {/* Sử dụng selectedImage */}
                    </Text>
                    <Text className="w-full break-words text-white">
                      {selectedImage.creator.email.split("@")[0]}@{" "}
                      {/* Sử dụng selectedImage */}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Nút đóng modal */}
              <TouchableOpacity
                className="absolute right-5 top-5" // Đặt nút ở bên phải
                onPress={() => setSelectedImage(null)} // Đóng modal
              >
                <Image source={icons.x} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default SearchCards;
