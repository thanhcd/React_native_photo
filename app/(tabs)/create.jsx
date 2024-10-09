import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import { icons } from "../../constants";
import CustomButton from "../../components/CustomButton";

const create = () => {
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    thumbnail: null,
    prompt: null,
  });


  const submit = async () => {

  }

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
          <TouchableOpacity onPress={() => openPicker('image')}>
            {form.thumbnail ? (
              <Image
                source={{uri: form.thumbnail.uri}}
                resizeMode='cover'
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

export default create;
