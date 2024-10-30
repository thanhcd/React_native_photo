import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Channel,
  ChannelList,
  MessageList,
  MessageInput,
} from "stream-chat-expo";
import { connectUser, disconnectUser, getClient } from "../../lib/streamchat";
import { useGlobalContext } from "../../context/GlobalProvider";
import ChatComponent from "../../components/ChatComponent";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";
import { icons } from "../../constants";
import { useFocusEffect } from "@react-navigation/native";

const Message = () => {
  const { user, isLoading } = useGlobalContext(); // Lấy thông tin người dùng từ context
  const client = getClient(); // Lấy client Stream Chat
  const [selectedChannel, setSelectedChannel] = useState(null); // State để lưu kênh đã chọn
  const [isConnected, setIsConnected] = useState(false); // State để theo dõi kết nối người dùng

  const handleBackMessage = () => {
    setSelectedChannel(null);
  };

  // Hiển thị thông tin của thành viên còn lại trong kênh
  const renderChannelInfo = () => {
    if (selectedChannel) {
      const members = selectedChannel.state.members;
      const currentUserId = user.$id;

      // Lọc ra đối phương trong kênh
      const otherMember = Object.values(members).find(
        (member) => member.user_id !== currentUserId
      );

      if (otherMember) {
        return (
          <View className="flex-row items-center">
            <Image
              source={{
                uri:
                  otherMember.user.image ||
                  "https://example.com/default-avatar.png",
              }}
              className="w-10 h-10 rounded-full"
              resizeMode="cover"
            />
            <Text className="text-2xl ml-2">
              {otherMember.user.name || "Unknown User"}
            </Text>
          </View>
        );
      } else {
        return <Text className="text-2xl">No other members</Text>;
      }
    }
    return null;
  };

  // Sử dụng useFocusEffect để xử lý kết nối và ngắt kết nối
  useFocusEffect(
    useCallback(() => {
      const checkConnect = async () => {
        try {
          // Kiểm tra nếu đã kết nối
          if (!isConnected && user) {
            const userId = user.$id;
            const userName = user.username || "User";
            const userImage =
              user.avatar || "https://example.com/default-avatar.png";
            const userToken = client.devToken(userId);

            await connectUser(userId, userName, userImage, userToken);
            setIsConnected(true); // Đánh dấu đã kết nối
          }
        } catch (error) {
          console.error("Error connecting user:", error.message);
        }
      };

      checkConnect();

      // Hàm cleanup để ngắt kết nối khi tab bị chuyển
      return () => {
        if (isConnected) {
          disconnectUser();
          setIsConnected(false);
        }
      };
    }, [user, isConnected]) // Sử dụng useCallback để tránh re-render không cần thiết
  );

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />; // Hiển thị loading nếu đang tải
  }

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="h-full px-4 pt-10">
        <View className="flex-row justify-between items-center">
          <Text className="text-4xl font-cbold">Messages</Text>

          {selectedChannel && ( // Kiểm tra nếu đang ở trong một kênh
            <TouchableOpacity onPress={handleBackMessage}>
              <Image
                source={icons.leftArrow}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>

        {!selectedChannel ? (
          // Hiển thị danh sách kênh nếu chưa có kênh nào được chọn
          <ChatComponent>
            {user ? ( // Kiểm tra xem user có tồn tại hay không
              <ChannelList
                client={client} // Truyền client vào ChannelList
                filters={{ type: "messaging", members: { $in: [user.$id] } }} // Lọc kênh theo loại messaging
                sort={{ last_message_at: -1 }} // Sắp xếp kênh theo tin nhắn cuối cùng
                onSelect={(channel) => {
                  console.log("Selected channel:", channel);
                  setSelectedChannel(channel); // Cập nhật kênh đã chọn
                }}
              />
            ) : (
              <Text>Vui lòng đăng nhập để xem danh sách kênh</Text> // Thông báo khi user không tồn tại
            )}
          </ChatComponent>
        ) : (
          // Hiển thị danh sách tin nhắn và input khi đã chọn kênh
          <ChatComponent>
            <Channel channel={selectedChannel}>
              <View className="h-full pb-10">
                {/* Hiển thị thông tin đối phương */}
                {renderChannelInfo()}
                <MessageList />
                <MessageInput />
              </View>
            </Channel>
          </ChatComponent>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Message;
