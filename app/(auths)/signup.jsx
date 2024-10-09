import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import { icons } from "../../constants";
import { router } from "expo-router";
import CustomButton from "../../components/CustomButton";

const signup = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  return (
    <SafeAreaView className="h-full justify-center px-4 py-10">
      <TouchableOpacity onPress={() => router.push("/")} className="w-full">
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
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-5"
            keyboardType="email-address"
            placeholder="user@gmail.com"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-5"
            keyboardType="password"
            placeholder="********"
          />
          <CustomButton
            title="Next"
            handlePress={() => {
              router.push({
                pathname: "/signupname",
                params: { email: form.email, password: form.password },
              });
            }}
            containerStyles="h-16 bg-black rounded-lg mt-5"
            textStyles="text-white"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default signup;
