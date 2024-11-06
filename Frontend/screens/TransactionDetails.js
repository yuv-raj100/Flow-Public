import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import BackArrow from "../svgs/BackArrow";
import Dustbin from "../svgs/Dustbin";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "@env";

const h = Dimensions.get("window").height;

const TransactionDetails = ({ route }) => {
  const navigation = useNavigation();

  const {
    isReceived,
    amount,
    transactionId,
    username,
    customerId,
    email,
    desc,
    reminderDate,
    billDate,
    createdOn,
  } = route.params;

  const [loading, setLoading] = useState(false); // State to manage loading

  const handleDelete = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(
        `${API_URL}/deleteTransaction/${customerId}/${transactionId}/${email}`,
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
        navigation.pop();
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
    <View  className="bg-bgColor h-[100%]">
      <View className="flex-row items-center bg-BlueColor p-2">
        <TouchableOpacity className="mr-2" onPress={() => navigation.pop()}>
          <BackArrow />
        </TouchableOpacity>
        <View
          style={{ width: h * 0.05, height: h * 0.05 }}
          className="rounded-full justify-center items-center bg-white mr-2"
        >
          <Text
            style={{ fontSize: Math.floor(h * 0.03) }}
            className="font-bold"
          >
            {username.toUpperCase()[0]}
          </Text>
        </View>
        <Text className="text-lg font-semibold text-white">{username}</Text>
      </View>

      <View className="items-center my-5">
        <Text
          className={`${
            isReceived ? "text-GreenColor" : "text-red-600"
          } text-4xl font-bold`}
        >
          ₹ {amount}
        </Text>
      </View>

      <View style={styles.detailContainer} className="p-4">
        <Text className="text-slate-400 text-lg">Description:</Text>
        <Text className="text-white text-lg mb-4">
          {desc || "No description provided"}
        </Text>

        <Text className="text-slate-400 text-lg">Bill Date: </Text>
        <Text className="text-white text-lg mb-4">{billDate}</Text>

        <Text className="text-slate-400 text-lg">Reminder Date:</Text>
        <Text className="text-white text-lg mb-4">{reminderDate}</Text>

        <Text className="text-slate-400 text-lg">Created On:</Text>
        <Text className="text-white text-lg">{createdOn}</Text>
      </View>

      <TouchableOpacity onPress={handleDelete} className="mt-20">
        <View className="bg-gray-800 p-3 flex-row items-center justify-center">
          <Dustbin />
          {loading ? (
            <ActivityIndicator size="small" color="#f5dd4b" className="ml-5" />
          ) : (
            <Text className="text-slate-300 ml-5">Delete Credit</Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default TransactionDetails;

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
  },
});
