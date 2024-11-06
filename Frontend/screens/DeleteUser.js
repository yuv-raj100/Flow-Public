import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import BackArrow from "../svgs/BackArrow";
import { useNavigation } from "@react-navigation/native";
import ProfileImg from "../Images/profileImg.png";
import Dustbin from "../svgs/Dustbin";
import { API_URL } from "@env";

const DeleteUser = ({ route }) => {
  const { username, customerId, email } = route.params;

  const [loading, setLoading] = useState(false); // State to manage loading
  const navigation = useNavigation();

  const handleDelete = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(
        `${API_URL}/deleteUser/${email}/${customerId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error(`Error: ${response.status} - ${response.statusText}`);
        setLoading(false); // Stop loading on error
        return;
      }

      const result = await response.json();
      if (response.ok) {
        navigation.pop(2);
      } else {
        console.log("Cannot delete");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Stop loading after completion
    }
  };

  return (
    <View className="h-[100%] bg-bgColor">
      <View className="flex-row items-center bg-BlueColor p-2 justify-between mb-20">
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-2" onPress={() => navigation.pop()}>
            <BackArrow />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-white">Profile</Text>
        </View>
      </View>

      <View className="">
        <Image source={ProfileImg} className="h-[50%] w-[60%] mx-auto " />
        <Text className="text-3xl text-white mx-auto ">{username}</Text>
      </View>

      <TouchableOpacity onPress={handleDelete} disabled={loading}>
        <View className="bg-gray-800 p-3 flex-row items-center justify-center">
          <Dustbin />
          {loading ? (
            <ActivityIndicator size="small" color="#f5dd4b" className="ml-5" />
          ) : (
            <Text className="text-slate-300 ml-5">Delete User</Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default DeleteUser;

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
  },
});
