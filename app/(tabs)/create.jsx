import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import { icons } from "../../constants";
import CustomButton from "../../components/CustomButton";
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router";
import { createPhoto } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const Create = () => {
  const { user } = useGlobalContext();
  // Kiểm tra nếu user là undefined
  if (!user) {
    Alert.alert("User not found", "Please log in again.");
    return null; // Hoặc có thể return một cái gì đó khác để ngăn không cho render
  }

  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    thumbnail: null,
    prompt: null,
  });

  // Hàm mở ImagePicker để chọn ảnh
  const openPicker = async () => {
    // Kiểm tra quyền truy cập
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Kiểm tra xem người dùng đã chọn ảnh chưa và cập nhật thumbnail
    if (!result.canceled) {
      setForm({ ...form, thumbnail: result.assets[0] });
    } else {
      Alert.alert("Image picking was canceled.");
    }
  };

  const submit = async () => {
    console.log("Form values:", form); // In giá trị của form ra để kiểm tra
  
    if (!form.prompt || !form.thumbnail || !form.title) {
      Alert.alert("Please fill all the fields");
      return; // Thoát khỏi hàm nếu có trường không hợp lệ
    }
  
    if (!user || !user.$id) {
      Alert.alert("User not found", "Please log in again.");
      return; // Thoát khỏi hàm nếu không có user
    }
  
    setUploading(true);
    try {
      await createPhoto({
        ...form,
        userId: user.$id,
      });
  
      Alert.alert("Success", "Post uploaded");
      router.push('/home');
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",
        thumbnail: null,
        prompt: null,
      });
      setUploading(false);
    }
  };
  

  return (
    <SafeAreaView className="h-full px-4 pt-10">
      <View>
        <Text className="text-4xl text-black font-cbold">Create</Text>
        <Text className="text-base font-cregular"> your photo post</Text>
        <FormField
          title="Photo title"
          value={form.title}
          placeholder="Get your image a title"
          otherStyles="rounded-md mt-7"
          handleChangeText={(e) => setForm({ ...form, title: e })}
        />
        <View className="mt-7 space-y-2">
          <Text className="text-base font-cmedium">Upload photo</Text>
          <TouchableOpacity onPress={openPicker}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-40 px-4 rounded-2xl justify-center items-center border-2 border-white-200 flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  className="w-6 h-6"
                />
                <Text className="text-sm font-cmedium">Choose a file</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField
          title="AI Prompt"
          value={form.prompt}
          placeholder="The Prompt u use to create this photo"
          otherStyles="rounded-md mt-7"
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
        />

        <CustomButton
          title="Submit"
          handlePress={submit}
          containerStyles="mt-7 rounded-lg"
          textStyles="text-white"
          isLoading={uploading}
        />
      </View>
    </SafeAreaView>
  );
};

export default Create;
