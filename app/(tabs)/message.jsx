// tabs/message.jsx
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Channel, ChannelList } from "stream-chat-expo";
import { connectUser, disconnectUser, getClient } from "../../lib/streamchat";
import { useGlobalContext } from "../../context/GlobalProvider";
import ChatComponent from "../../components/ChatComponent";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Message = () => {
  const { user, isLoading } = useGlobalContext(); // Lấy thông tin người dùng từ context
  const client = getClient(); // Lấy client Stream Chat
  const [channel, setChannel] = useState(null); // State để lưu kênh

  useEffect(() => {
    const setupStreamChat = async () => {
      if (user && user.$id) {
        // Kiểm tra xem user có hợp lệ không
        const userId = user.$id; // ID người dùng từ context
        const userName = user.username || "User"; // Tên người dùng từ context
        const userImage = user.avatar || "https://example.com/default-avatar.png"; // Avatar người dùng
        const userToken = client.devToken(userId); // Sử dụng devToken

        // Kết nối người dùng vào Stream Chat
        await connectUser(userId, userName, userImage, userToken);

        const newChannel = client.channel('messaging', 'the_park', {
          name: 'The Park',
        });

        // Tạo kênh trên server
        try {
          await newChannel.create();
          console.log('Channel created successfully:', newChannel);
          setChannel(newChannel); // Lưu kênh vào state
        } catch (error) {
          console.error('Error creating channel:', error);
        }
      }
    };

    setupStreamChat();

    // Cleanup khi component bị unmount
    return () => {
      disconnectUser();
    };
  }, [user]); // Chỉ chạy khi user thay đổi

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />; // Hiển thị loading nếu đang tải
  }

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="h-full px-4 pt-10">
      <View>
        <Text className="text-4xl font-cbold">Messages</Text>
        {channel && ( // Kiểm tra xem channel đã được tạo
          <ChatComponent>
            <Channel channel={channel}>
              <ChannelList
                client={client} // Truyền client vào ChannelList
                filters={{}} // Bộ lọc để lấy kênh (có thể thêm các điều kiện khác)
                sort={{ last_message_at: -1 }} // Sắp xếp kênh theo tin nhắn cuối cùng
                onSelect={(channel) => {
                  console.log("Selected channel:", channel); // Xử lý khi chọn kênh
                }}
              />
            </Channel>
          </ChatComponent>
        )}
      </View>
    </SafeAreaView>
    </GestureHandlerRootView>
    
  );
};

export default Message;
