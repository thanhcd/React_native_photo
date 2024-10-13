import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import { icons } from "../../constants";
import CustomButton from "../../components/CustomButton";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { createPhoto, updatePhoto } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const Create = () => {
  const { user } = useGlobalContext();

  if (!user) {
    Alert.alert("User not found", "Please log in again.");
    return null;
  }

  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    thumbnail: null,
    prompt: "",
  });

  // Get URL parameters
  const { Utitle, Uthumbnail, Uprompt, documentId } = useLocalSearchParams();

  // Initialize form if there are URL parameters
  useEffect(() => {
    if (Utitle) setForm((prev) => ({ ...prev, title: Utitle }));
    if (Uthumbnail) setForm((prev) => ({ ...prev, thumbnail: { uri: Uthumbnail } }));
    if (Uprompt) setForm((prev) => ({ ...prev, prompt: Uprompt }));
  }, [Utitle, Uthumbnail, Uprompt]);

  const openPicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setForm((prev) => ({ ...prev, thumbnail: result.assets[0] }));
    } else {
      Alert.alert("Image picking was canceled.");
    }
  };

  const submit = async () => {
    const { title, thumbnail, prompt } = form;
  
    if (!title || !prompt) {
      Alert.alert("Please fill all the fields");
      return;
    }
  
    setUploading(true);
    try {
      if (documentId) {
        // Chỉ thêm `thumbnail` nếu có giá trị
        const updatedData = { title, prompt };
  
        // Nếu có thumbnail mới, thêm vào updatedData
        if (thumbnail) {
          updatedData.thumbnail = thumbnail;
        }
  
        await updatePhoto(documentId, updatedData);
        Alert.alert("Success", "Post updated");
      } else {
        await createPhoto({ ...form, userId: user.$id });
        Alert.alert("Success", "Post uploaded");
      }
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({ title: "", thumbnail: null, prompt: "" });
      setUploading(false);
    }
  };
  
  return (
    <SafeAreaView className="h-full px-4 pt-10">
      <ScrollView>
        <Text className="text-4xl text-black font-cbold">{documentId ? ("Update") : ("Create")}</Text>
        <Text className="text-base font-cregular"> your photo post</Text>

        <FormField
          title="Photo title"
          value={form.title}
          placeholder="Get your image a title"
          otherStyles="rounded-md mt-7"
          handleChangeText={(text) => setForm((prev) => ({ ...prev, title: text }))}
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
              <View className="w-full h-40 px-4 rounded-2xl justify-center items-center border-2 border-grey-200 flex-row space-x-2">
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
          handleChangeText={(text) => setForm((prev) => ({ ...prev, prompt: text }))}
        />

        <CustomButton
          title="SUBMIT"
          handlePress={submit}
          containerStyles="w-full mt-5 border-2 border-grey bg-white rounded-lg"
          textStyles="text-black"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
