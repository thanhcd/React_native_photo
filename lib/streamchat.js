import { StreamChat } from 'stream-chat';

const API_KEY = 'yev26yzsqh9v';  // Thay bằng API Key từ Stream
const client = StreamChat.getInstance(API_KEY);

// Hàm để kết nối người dùng vào Stream Chat
export const connectUser = async (userId, userName, userImage, userToken) => {
  try {
    await client.connectUser(
      {
        id: userId,
        name: userName,
        image: userImage,
      },
      userToken
    );
    console.log('User connected successfully!');
  } catch (error) {
    console.error('Error connecting user:', error);
  }
};

// Hàm để ngắt kết nối người dùng khỏi Stream Chat (khi đăng xuất)
export const disconnectUser = async () => {
  try {
    await client.disconnectUser();
    console.log('User disconnected successfully!');
  } catch (error) {
    console.error('Error disconnecting user:', error);
  }
};

// Hàm để lấy client đã khởi tạo
export const getClient = () => {
  return client;
};
