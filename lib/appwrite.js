import {
  Avatars,
  Client,
  Databases,
  Query,
  Storage,
} from "react-native-appwrite";
import { Account } from "react-native-appwrite";
import { ID } from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.photo",
  projectId: "66fd02a20028c679b160",
  databaseId: "66fd081700139aa39002",
  userCollectionId: "66fd082f000244bf4c70",
  photoCollectionId: "66fd084d002682618c1d",
  storageId: "66fd0896002f5d4a6447",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  photoCollectionId,
  storageId,
} = config;

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
  // Register User
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    console.log("Account created:", newAccount);
    if (!newAccount) throw error;
    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);
    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );
    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export async function signOut() {
  try {
    const session = await account.deleteSession("current");
    console.log("Đã thoát đăng nhập")
    return session;
  } catch (error) {
    throw new Error(error);
  }
}


export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    // console.log("Current Account:", currentAccount); // Log current account info

    if (!currentAccount) throw new Error("No current account");

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    
    // console.log("Current User:", currentUser); // Log current user info
    
    if (!currentUser) throw new Error("No user found");
    return currentUser.documents[0];
  } catch (error) {
    console.log("Error fetching current user:", error);
  }
};



export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, photoCollectionId);
    return posts;
  } catch (error) {
    throw new Error(error);
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, photoCollectionId, [
      Query.orderDesc("$createdAt"), 
      Query.limit(3),               
    ]);
    return posts;
  } catch (error) {
    throw new Error(error.message);  // Thêm `message` để dễ hiểu hơn
  }
};


export const searchPosts = async (query) => {
  if (!query || query.trim() === "") {
    throw new Error("Invalid query: query cannot be empty");
  }

  try {
    const posts = await databases.listDocuments(
      databaseId,
      photoCollectionId,
      [Query.search("title", query)] // Chỉ truyền 1 giá trị query
    );
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getUserByAccountId = async (accountId) => {
  try {
    const user = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", accountId)]
    );

    return user.documents[0]; // Trả về người dùng đầu tiên (nếu có)
  } catch (error) {
    console.log("Error getting user:", error);
    throw new Error(error);
  }
};

export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      photoCollectionId,
      [Query.equal("creator", userId)] 
    );
    // console.log("Posts from API:", posts);
    return posts.documents;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch posts.");
  }
};

export const getFilePreview = async (fileId, type) => {
  let fileUrl;
  try {
    console.log("Fetching file preview for fileId:", fileId); // Log fileId
    if (type === "image") {
      fileUrl = await storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw new Error("Unable to retrieve file URL");
    return fileUrl;
  } catch (error) {
    console.error("Error getting file preview:", error); // In lỗi ra console
    throw new Error(`Failed to get file preview: ${error.message}`);
  }
};

export const uploadFile = async (file, type) => {
  if (!file) {
    throw new Error("File is not provided");
  }

  const asset ={
    name : file.fileName,
    type : file.mimeType,
    size : file.fileSize,
    uri : file.uri
  }

  try {
    const uploadFile = await storage.createFile(storageId, ID.unique(), asset);
    console.log("Response from createFile:", uploadFile);
    const fileUrl = await getFilePreview(uploadFile.$id, type);
    return fileUrl;
  } catch (error) {
    console.error("Error during file upload:", error.message); // In chi tiết lỗi ra console
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

export const createPhoto = async (form) => {
  try {
    // Chắc chắn rằng bạn đang truyền vào đúng file
    const thumbnailUrl = await uploadFile(form.thumbnail, "image");

    const newPost = await databases.createDocument(
      databaseId,
      photoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error.message);
  }
};



// export const checkFileExists = async (fileId) => {
//   try {
//     const file = await storage.getFile(storageId, fileId);
//     console.log('File tồn tại:', file);
//     return true; // File tồn tại
//   } catch (error) {
//     if (error.code === 404) {
//       console.error('File không tồn tại');
//     } else {
//       console.error('Lỗi khi kiểm tra file:', error);
//     }
//     return false; // File không tồn tại
//   }
// };

// Hàm deletePhoto
// export const deletePhoto = async (fileId) => {
//   try {
//     await storage.deleteFile(config.storageId, fileId); 
//     console.log('File đã được xóa thành công');
//   } catch (error) {
//     console.error('Lỗi khi xóa file:', error);
//     throw new Error(`Failed to delete file: ${error.message}`);
//   }
// };


export const deletePhoto = async (documentId) => {
  try {
    // Xóa document trong cơ sở dữ liệu
    await databases.deleteDocument(config.databaseId, config.photoCollectionId, documentId);
    console.log('Document đã được xóa thành công');
  } catch (error) {
    console.error('Lỗi khi xóa document: ', error);
  }
};
//Hàm follow user khác
export const addFollowUser = () => {};

//Hàm di chuyển  khi click vào user khác
export const searchUser = () => {};
