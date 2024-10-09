import { Avatars, Client, Databases, Query, Storage } from "react-native-appwrite";
import { Account } from "react-native-appwrite";
import { ID } from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.photo",
  projectId: "66fd02a20028c679b160",
  databaseId: "66fd081700139aa39002",
  userCollectionId: "66fd082f000244bf4c70",
  photoCollectionId: "66fd084d002682618c1d",
  stogareId: "66fd0896002f5d4a6447",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  photoCollectionId,
  stogareId,
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
const stogare = new Storage(client);

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


export const signIn = async (email, password) =>{
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        throw new Error(error)
    }
}


export const getCurrentUser = async () =>{
    try {
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )
        if(!currentUser) throw Error;
        return currentUser.documents[0];
    } catch (error) {
        console.log(error)
    }
}

export const getAllPosts = async () =>{
  try {
    const posts = await databases.listDocuments(
      databaseId,
      photoCollectionId,
    )
    return posts;
  } catch (error) {
    throw new Error(error);
  }
}

export const getLatestPosts = async () =>{
  try {
    const posts = await databases.listDocuments(
      databaseId,
      photoCollectionId,
      [Query.orderDesc('$createdAt', Query.limit(7))],
    )
    return posts;
  } catch (error) {
    throw new Error(error);
  }
}

export const searchPosts = async (query) => {
  if (!query || query.trim() === "") {
    throw new Error("Invalid query: query cannot be empty");
  }

  try {
    const posts = await databases.listDocuments(
      databaseId,
      photoCollectionId,
      [Query.search('title', query)]  // Chỉ truyền 1 giá trị query
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
      [Query.equal('accountId', accountId)]
    );

    return user.documents[0]; // Trả về người dùng đầu tiên (nếu có)
  } catch (error) {
    console.log("Error getting user:", error);
    throw new Error(error);
  }
};

export const getUserPosts = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  try {
    const posts = await databases.listDocuments(
      databaseId,
      photoCollectionId,
      [Query.equal('creator', userId)] // Sử dụng creatorId thay vì creator
    );
    console.log("Posts from API:", posts);
    return posts.documents;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch posts.");
  }
};


export const getFilePreview = async () => {
  let fileUrl;
  try {
    if(type === 'image'){
      fileUrl = stogare.getFilePreview(stogareId, fileId, 2000, 2000, 'top', 100)
    }
    else{
      throw new Error('Invalid file type')
    }
    if(!fileUrl) throw Error;

    return fileUrl
  } catch (error) {
    throw new Error(error)
    
  }
}

export const uploadFile = async (file, type) =>{
  if(!file) return;
  const {mineType, ...rest} = file;
  const asset = {type : mineType, ...rest};

  console.log(file )
   try {
    const uploadFile = await stogare.createFile(
      stogareId,
      ID.unique(),
      asset
    );
    
    const fileUrl = await getFilePreview(uploadFile.$id, type);
    return fileUrl;
   } catch (error) {
    throw new Error(error)
    
   }
}

export const createPhoto = async (form) => {
  try {
    const [thumbnailUrl] = await Promise.all([
      uploadFile(form.thumbnail, 'image'),
    ])

    const newPost = await databases.createDocument(databaseId, photoCollectionId, ID.unique(),{
      title: form.title,
      thumbnail : thumbnailUrl,
      prompt : form.prompt,
      creator : form.userId,
    })

    return newPost;
  } catch (error) {
    throw new Error(error)
  }
}

//Hàm follow user khác
export const addFollowUser = () => {

}

//Hàm di chuyển  khi click vào user khác
export const searchUser = () => {

}