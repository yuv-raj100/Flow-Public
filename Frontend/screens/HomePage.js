import { View, Text, StatusBar, StyleSheet } from "react-native";
import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ledger from "./Ledger";
import Setting from "./Setting";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import RemindersPage from "./RemindersPage";
import Ionicons from "react-native-vector-icons/Ionicons";
import ProfilePage from "./ProfilePage";

const Tab = createBottomTabNavigator();

const HomePage = () => {

  const email = "raj@123";

  // const getUserEmail = async () => {
  //   try {
  //     const email = await AsyncStorage.getItem("user");
  //     setEmail(email);
  //   } catch (error) {
  //     console.error("Error retrieving email", error);
  //   }
  // };

  const setUserEmail = async () => {
    try {
      await AsyncStorage.setItem("user", email);
    } catch (error) {
      console.error("Error saving group name", error);
    }
  };

  setUserEmail();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { paddingBottom:5 },
      }}
    >
      <Tab.Screen
        name="Ledger"
        component={Ledger}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={20}
              color={focused ? "#3A81F1" : "#808080"}
            />
          ),
          tabBarLabelStyle: { marginBottom: 0 }, // Adjust this value as needed
        }}
        showLabel={true} // Show label to see the effect
      />
      <Tab.Screen
        name="Reminders"
        component={RemindersPage}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "alarm" : "alarm-outline"}
              size={20}
              color={focused ? "#3A81F1" : "#808080"}
            />
          ),
          tabBarLabelStyle: { marginBottom: 0 }, // Adjust this value as needed
        }}
        showLabel={true} // Show label to see the effect
      />
      <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={20}
              color={focused ? "#3A81F1" : "#808080"}
              containerStyle={{ marginBottom: -1 }}
            />
          ),
        }}
        showLabel={true} // Show label to see the effect
      />
    </Tab.Navigator>
  );
};

export default HomePage;
