import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import { icons } from "../../constants";
import CustomButton from "../../components/CustomButton";
import { createUser } from "../../lib/appwrite";
import { useLocalSearchParams, router } from "expo-router";

const signupname = () => {
  const { email, password } = useLocalSearchParams(); // Nhận params từ trang trước
  console.log("Email:", email);
  console.log("Password:", password);
  const [form, setForm] = useState({
    email: email || "", // Sử dụng email từ params
    password: password || "", // Sử dụng password từ params
    username: "", // Đặt 'name' ở đây thay vì 'username'
  });

  const [isSubmiting, setIssubmiting] = useState(false);

  const submit = async () => {
    console.log("Form Values:", form); // Log giá trị của form
    
    if (!form.username || !form.email || !form.password) {
      Alert.alert("Error", "please fill all the fields");
      console.log("Username:", form.username); // Sửa log cho 'username'
      return; // Thêm return ở đây để tránh tiếp tục xử lý khi thiếu dữ liệu
    }
    
    setIssubmiting(true);
    
    try {
      const result = await createUser(form.email, form.password, form.username);
      console.log("User Created:", result); // Log kết quả khi người dùng được tạo thành công
      router.replace("/home");
      return result;
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIssubmiting(false);
    }
  };
  
  return (
    <SafeAreaView className="h-full justify-center px-4 py-10">
      <TouchableOpacity
        onPress={() => router.push("/signup")}
        className="w-full"
      >
        <Image
          source={icons.leftArrow}
          className="h-4 w-4"
          resizeMode="contain"
        />
      </TouchableOpacity>

      <ScrollView>
        <View className="w-full min-h-[83vh] py-10">
          <Text className="text-4xl text-black font-cbold">Register</Text>
          <FormField
            title="your display name"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-5"
            keyboardType=""
            placeholder="Your name"
          />
          <CustomButton
            title="SIGN UP"
            // handlePress={() => {
            //   router.push("/home");
            // }}
            handlePress={submit}
            containerStyles="h-16 bg-black rounded-lg mt-5"
            textStyles="text-white"
            isLoading={isSubmiting}
          />
          <Text className="text-sm mt-8">
            By signing up, you agree to Photo's{" "}
            <Text style={{ textDecorationLine: "underline" }}>
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text style={{ textDecorationLine: "underline" }}>
              Privacy Policy
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default signupname;
