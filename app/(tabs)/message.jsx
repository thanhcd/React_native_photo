import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { connectUser, disconnectUser, getClient } from "../../lib/streamchat";
import { useGlobalContext } from "../../context/GlobalProvider";

const Message = () => {
  const { user, isLoading } = useGlobalContext(); // Lấy thông tin người dùng từ context
  console.log("User từ global context", user);
  useEffect(() => {
    const setupStreamChat = async () => {
      if (user) {
        const userId = user.$id; // ID người dùng từ context
        const userName = user.username || "User"; // Tên người dùng từ context
        const userImage =
          user.avatar || "https://example.com/default-avatar.png"; // Avatar người dùng
        const userToken = getClient().devToken(userId); // Sử dụng devToken

        // Kết nối người dùng vào Stream Chat
        await connectUser(userId, userName, userImage, userToken);
        console.log("UserId từ global context", userId);
        console.log("UserName từ global context", userName);
      }
    };

    setupStreamChat();

    // Cleanup khi component bị unmount
    return () => {
      disconnectUser();
    };
  }, [user]); // Chỉ chạy khi user thay đổi

  if (isLoading) {
    return <Text>Loading...</Text>; // Hiển thị loading nếu đang tải
  }

  return (
    <SafeAreaView className="h-full px-4 pt-10">
      <View>
        <Text className="text-4xl font-cbold">Messages</Text>
      </View>
    </SafeAreaView>
  );
};

export default Message;
