import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  ActivityIndicator,
} from "react-native";
import CustomButton from "../../components/CustomButton";
import { useGlobalContext } from "../../context/GlobalProvider";
import {
  createChannel,
  connectUser,
  getClient,
  disconnectUser,
} from "../../lib/streamchat"; // Import connectUser từ file lib

const UserProfile = () => {
  const router = useRouter();
  const { userId, username, avatar, email } = useLocalSearchParams();
  const { user } = useGlobalContext(); // Lấy user đăng nhập từ context
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State to track loading

  const handleMessagePress = async () => {
    setIsLoading(true); // Bắt đầu trạng thái loading
    try {
      const currentUserId = user.$id; // Lấy userId của người đăng nhập
      const client = getClient();

      // Kiểm tra kết nối, nếu chưa kết nối thì thực hiện kết nối
      if (!isConnected && currentUserId) {
        const currentUserId = user.$id;
        const currentuserName = user.username || "User";
        const currentuserImage =
          user.avatar || "https://example.com/default-avatar.png";
        const userToken = client.devToken(currentUserId);

        await connectUser(currentUserId, currentuserName, currentuserImage, userToken);
        setIsConnected(true); // Đánh dấu đã kết nối
      }

      if (currentUserId !== userId) {
        // Tạo kênh giữa user đăng nhập và người mục tiêu
        const channel = await createChannel(currentUserId, userId, username);
        if (channel) {
          console.log("Channel created successfully:", channel);

          // Nếu bạn cần ngắt kết nối người dùng hiện tại (tùy theo logic dự án của bạn)
          // await disconnectUser();

          // Chuyển hướng sang trang tin nhắn với channelId
          router.push({
            pathname: "/message",
            params: { channelId: channel.id }, // Gửi channelId sang trang tin nhắn
          });
        } else {
          console.error("Channel creation failed");
        }
      } else {
        console.error("Cannot create channel with the same user");
      }
    } catch (error) {
      console.error("Error creating channel:", error);
    } finally {
      setIsLoading(false); // Kết thúc trạng thái loading
    }
  };

  // Kiểm tra dữ liệu người dùng cần thiết
  if (!userId || !username || !avatar || !email) {
    return (
      <SafeAreaView className="h-full my-4">
        <Text className="text-xl mt-4">User information is missing...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="h-full pt-10 px-4">
      <View className="items-center w-full">
        <View className="w-[100px] h-[100px] rounded-full p-0.5">
          <Image
            source={{ uri: avatar }}
            className="w-full h-full rounded-full"
            resizeMode="cover"
          />
        </View>
        <Text className="text-4xl text-black font-cbold mt-8">{username}</Text>
        <Text className="text-xl mt-2 text-center">{email.split("@")[0]}@</Text>
      </View>
      <View className="min-h-[30vh] mt-8">
        <View className="justify-center w-full">
          {/* <CustomButton
            title={`FOLLOW ${username}`}
            handlePress={() => {}}
            containerStyles="w-full h-[50px] bg-black rounded-lg mb-4"
            textStyles="text-white"
          /> */}
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <CustomButton
              title="MESSAGE"
              handlePress={handleMessagePress} // Thêm hàm xử lý khi nhấn nút
              containerStyles="w-full h-[50px] border-2 border-grey bg-white rounded-lg"
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UserProfile;
