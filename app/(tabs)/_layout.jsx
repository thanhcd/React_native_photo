import { View, Text, Image } from "react-native";
import React from "react";
import { Tabs, Redirect } from "expo-router";
import { icons } from "../../constants";
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from "expo-status-bar";

const TabIcon = ({ icon, color, name, focused, customClass }) => {
  return (
    <View>
      <Image
        source={icon}
        resizeMode="contain"
        className={customClass} // Dùng class được truyền vào
        tintColor={color}
      />
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "black",
          tabBarStyle: {
            borderTopColor: "#CDCDE0",
            height: 84,
            borderTopWidth: 1,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarLabel: "", // Ẩn label
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.house1}
                color={color}
                name="Home"
                focused={focused}
                customClass="w-6 h-6"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="searching"
          options={{
            title: "search",
            headerShown: false,
            tabBarLabel: "", // Ẩn label
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.search2}
                color={color}
                name="Home"
                focused={focused}
                customClass="w-6 h-6"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "create",
            headerShown: false,
            tabBarLabel: "", 
            tabBarIcon: ({ color, focused }) => (
              <LinearGradient 
                colors={['#FFA001', '#FF00FF']} // Màu gradient
                style={{ 
                  borderRadius: 30, // Để có hình dạng oval
                  padding: 15, // Thêm padding nếu cần
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 48,
                  width: 90,
                }}
              >
                <TabIcon
                  icon={icons.plus2}
                  color="#FFFFFF" // Màu icon
                  focused={focused}
                  customClass="w-5 h-5" 
                />
              </LinearGradient>
            ),
          }}
        />
        <Tabs.Screen
          name="message"
          options={{
            title: "message",
            headerShown: false,
            tabBarLabel: "", // Ẩn label
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.message2}
                color={color}
                name="Home"
                focused={focused}
                customClass="w-7 h-7"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "profile",
            headerShown: false,
            tabBarLabel: "", // Ẩn label
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile1}
                color={color}
                name="Home"
                focused={focused}
                customClass="w-6 h-6"
              />
            ),
          }}
        />
      </Tabs>
      <StatusBar backgroundColor="#161622" style='light'/>

    </>
  );
};

export default TabsLayout;
