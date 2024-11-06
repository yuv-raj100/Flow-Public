import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const LoginButton = ({ isLogin }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      className="my-2 mx-8 border-slate-400 border border-b-2 rounded-md"
      onPress={() => navigation.push("LoginPage", { isLogin: isLogin })}
    >
      <View
        className={`bg-${
          isLogin ? "BlueColor" : "BlueColor"
        }  px-2 py-4 rounded-md`}
      >
        <Text className="text-center text-white text-lg font-semibold">
          {isLogin ? "Log in" : "Sign up"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default LoginButton;
