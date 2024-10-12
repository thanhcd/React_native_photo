import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import { icons } from "../../constants";
import { router } from "expo-router";
import CustomButton from "../../components/CustomButton";
import { getCurrentUser, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";


const login = () => {
  const { setUser, setIsLogged } = useGlobalContext()

  const [form, setForm] = useState({
    email:'',
    password:'',
  })

  const [isSubmiting, setIssubmiting] = useState(false);

  const submit = async () => {
    // console.log("Form Values:", form); // Log giá trị của form
    
    if (!form.email || !form.password) {
      Alert.alert("Error", "please fill all the fields");
      // console.log("Username:", form.username); // Sửa log cho 'username'
      return; // Thêm return ở đây để tránh tiếp tục xử lý khi thiếu dữ liệu
    }
    
    setIssubmiting(true);
    
    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);

      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIssubmiting(false);
    }
  };

  return (
    <SafeAreaView className="h-full justify-center px-4 py-10">
      <TouchableOpacity onPress={() => router.push('/')} className="w-full">
        <Image
          source={icons.leftArrow}
          className="h-4 w-4"
          resizeMode="contain"
        />
      </TouchableOpacity>
      <ScrollView>
         <View className="w-full min-h-[83vh] py-10">
        <Text className="text-4xl text-black font-cbold">Log in</Text>
        <FormField 
          title="Email"
          value={form.email}
          handleChangeText={(e) =>setForm({...form, email: e})}
          otherStyles="mt-7"
          keyboardType="email-address"
          placeholder="user@gmail.com"
        />
        <FormField 
          title="Password"
          value={form.password}
          handleChangeText={(e) =>setForm({...form, password: e})}
          otherStyles="mt-5"
          keyboardType="password"
          placeholder="********"
        />
        <CustomButton
          title="LOG IN"
            handlePress={submit}
            containerStyles="h-16 bg-black rounded-lg mt-5"
            textStyles="text-white"
        />
      </View>
      </ScrollView>
     
    </SafeAreaView>
  );
};

export default login;
