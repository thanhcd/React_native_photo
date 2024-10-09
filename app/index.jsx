import { Link, Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../constants/images";
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";
import { useGlobalContext } from "../context/GlobalProvider";

export default function App() {
  const {isLoading, isLogged} = useGlobalContext();
  if(!isLoading && isLogged) 
    return <Redirect href='/home'/>
  return (
    <SafeAreaView className="flex-1 h-full">
      <View className="flex-1 justify-center items-center">
        <View className="flex-row items-center">
          <Image
            source={images.logoS}
            className="w-10 h-10 mr-2"
          />
          <Text className="text-5xl text-black font-cbold">photo</Text>
        </View>
        <Link href="/home" className="mt-2">
          go home
        </Link>
      </View>

      <View className="min-h-[110px] bg-white">
        <View className="flex-row justify-between w-full mt-5 px-6">
          <CustomButton
            title="LOG IN"
            handlePress={() => {
              router.push("/login");
            }}
            containerStyles="w-44 h-[15] border-2 border-grey  bg-white rounded-lg"
          />
          <CustomButton
            title="REGISTER"
            handlePress={() => {
              router.push("/signup");
            }}
            containerStyles="w-44 h-[15] bg-black rounded-lg"
            textStyles="text-white"
          />
        </View>
      </View>
      <StatusBar backgroundColor="#161622" style="light"/>
    </SafeAreaView>
  );
}
