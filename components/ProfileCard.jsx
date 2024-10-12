import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Text,
} from "react-native";
import React, { useState } from "react";
import CustomButton from "./CustomButton";
import { icons } from "../constants";
import { deletePhoto, checkFileExists } from "../lib/appwrite";
import { router } from "expo-router";

const ProfileCard = ({ posts }) => {
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

  const handleDelete = async () => {
    if (selectedImage) {
      try {
        console.log("ID của document đang cố gắng xóa:", selectedImage.$id); // Log ID của document
        // Gọi hàm deletePhoto với ID của document đã chọn
        await deletePhoto(selectedImage.$id);
        // Nếu xóa thành công, bạn có thể reset selectedImage hoặc thực hiện bất kỳ hành động nào khác
        setSelectedImage(null);
        console.log("Ảnh đã được xóa thành công");
      } catch (error) {
        console.error("Lỗi khi xóa ảnh: ", error);
      }
    } else {
      console.log("Không có ảnh nào được chọn để xóa.");
    }
  };

  const handleUpdate = async () => {
    if (selectedImage) {
      try {
        console.log(
          "ID của document đang cố gắng cập nhật:",
          selectedImage.$id
        ); 

        router.push({
          pathname: "/create",
          params: {
            Utitle: selectedImage.title,
            Uthumbnail: selectedImage.thumbnail,
            Uprompt: selectedImage.prompt,
            documentId: selectedImage.$id, // Truyền ID của document
          },
        });
      } catch (error) {
        console.error("Lỗi khi cố gắng cập nhật ảnh: ", error);
      }
    } else {
      console.log("Không có ảnh nào được chọn để cập nhật.");
    }
  };

  return (
    <>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View className="flex-row flex-wrap justify-between">
          {posts.slice(0, visibleCount).map((post, index) => (
            <TouchableOpacity
              key={index}
              className="w-[30%] my-2"
              onPress={() => setSelectedImage(post)}
            >
              <Image
                source={{ uri: post.thumbnail }}
                className="w-full h-[180px]"
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}

          {/* Nếu chỉ có 2 ảnh, thêm một View trống để giữ chỗ cho ảnh thứ 3 */}
          {posts.length === 2 && <View className="w-[30%] my-2" />}
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

            {/* Thêm 2 nút Delete và Update ở bên dưới */}
            <View className="min-h-[150px]">
              <View className="flex-row justify-between w-full mb-10 px-6">
                <CustomButton
                  title="DELETE"
                  handlePress={handleDelete} // Viết logic xóa ảnh
                  containerStyles="w-44 h-[15] border-2 border-grey bg-white rounded-lg"
                />
                <CustomButton
                  title="UPDATE"
                  handlePress={handleUpdate} // Viết logic cập nhật ảnh
                  containerStyles="w-44 h-[15] bg-black border-2 border-white rounded-lg"
                  textStyles="text-white"
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

export default ProfileCard;
