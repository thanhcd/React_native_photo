import React, { useEffect, useState } from "react";
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
import { router } from "expo-router";

const Message = () => {
  const { user, isLoading } = useGlobalContext(); // Lấy thông tin người dùng từ context
  const client = getClient(); // Lấy client Stream Chat
  const [selectedChannel, setSelectedChannel] = useState(null); // State để lưu kênh đã chọn

  const handleBackMessage = () => {
    setSelectedChannel(null); 
  }

  useEffect(() => {
    const setupStreamChat = async () => {
      if (user && user.$id) {
        const userId = user.$id; // ID người dùng từ context
        const userName = user.username || "User"; // Tên người dùng từ context
        const userImage =
          user.avatar || "https://example.com/default-avatar.png"; // Avatar người dùng
        const userToken = client.devToken(userId); // Sử dụng devToken

        // Kết nối người dùng vào Stream Chat
        await connectUser(userId, userName, userImage, userToken);

        const newChannel = client.channel("messaging", "the_park", {
          name: "The Park",
        });

        // Tạo kênh trên server nếu chưa có
        try {
          await newChannel.create();
          console.log("Channel created successfully:", newChannel);
        } catch (error) {
          console.error("Error creating channel:", error);
        }
      }
    };

    setupStreamChat();

    // Cleanup khi component bị unmount
    return () => {
      disconnectUser();
    };
  }, [user]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />; // Hiển thị loading nếu đang tải
  }

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="h-full px-4 pt-10">
        <View className="flex-row flex-row justify-between items-center">
          <Text className="text-4xl font-cbold">Messages</Text>
          <TouchableOpacity
          onPress={handleBackMessage}>
            <Image
              source={icons.leftArrow}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {!selectedChannel ? (
          // Hiển thị danh sách kênh nếu chưa có kênh nào được chọn
          <ChatComponent>
            <ChannelList
              client={client} // Truyền client vào ChannelList
              filters={{ type: "messaging" }} // Lọc kênh theo loại messaging
              sort={{ last_message_at: -1 }} // Sắp xếp kênh theo tin nhắn cuối cùng
              onSelect={(channel) => {
                console.log("Selected channel:", channel);
                setSelectedChannel(channel); // Cập nhật kênh đã chọn
              }}
            />
          </ChatComponent>
        ) : (
          // Hiển thị danh sách tin nhắn và input khi đã chọn kênh
          <ChatComponent>
            <Channel channel={selectedChannel}>
              <View className="h-full pb-10">
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
