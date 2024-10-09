import { View, Text } from "react-native";
import React from "react";
import { Stack, Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";
const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="login"
          options={{
            title: "",
            headerShown: false,
            tabBarLabel: "", // Ẩn label
            tabBarStyle: { display: 'none' }
          }}
        />
        <Stack.Screen
          name="signup"
          options={{
            title: "",
            headerShown: false,
            tabBarLabel: "", // Ẩn label
            tabBarStyle: { display: 'none' }
          }}
        />
        <Stack.Screen
          name="signupname"
          options={{
            title: "",
            headerShown: false,
            tabBarLabel: "", // Ẩn label
            tabBarStyle: { display: 'none' },
          }}
        />
      </Stack>

      
    </>
  );
};

export default AuthLayout;
