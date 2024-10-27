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
    console.log('User connected successfully!, uSER đang đăng nhập', userName);
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

// export const createChannel = async (currentUserId, userId) => {
//   const client = getClient(); // Lấy client Stream Chat

//   try {
//     const newChannel = client.channel("messaging", {
//       members: [currentUserId, userId], // Chỉ 2 thành viên
//     });

//     await newChannel.watch(); // Theo dõi kênh và tạo nếu chưa có
//     return newChannel;
//   } catch (error) {
//     console.error("Error creating channel:", error);
//     return null;
//   }
// };


export const createChannel = async (currentUserId, targetUserId, targetUsername) => {
  const client = getClient(); // Lấy client Stream Chat

  try {
    // Tạo channel với ID duy nhất giữa 2 user
    const newChannel = client.channel("messaging", {
      members: [currentUserId, targetUserId], // Danh sách các thành viên trong kênh
      name: targetUsername,  // Tên của kênh (có thể là tên người dùng target)
    });

    await newChannel.watch(); // Theo dõi kênh và tạo nếu chưa có
    return newChannel;
  } catch (error) {
    console.error("Error creating channel:", error);
    return null;
  }
};
