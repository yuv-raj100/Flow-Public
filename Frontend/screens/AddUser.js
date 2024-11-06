import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import BackArrow from "../svgs/BackArrow";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/usersSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

const AddUser = () => {
  const navigation = useNavigation();
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const dispatch = useDispatch();
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setShowButton(false);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setShowButton(true);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    const getUserEmail = async () => {
      try {
        const email = await AsyncStorage.getItem("user");
        setEmail(email);
      } catch (error) {
        console.error("Error retrieving email", error);
      }
    };
    getUserEmail();
  }, []);

  const handleClick = async () => {
    if (!text) {
      setError("*Please enter a name");
      return;
    }
    const data = {
      customerName: text,
      email: email,
      isDue: false,
      amount: "0",
      date: "NA",
    };
    dispatch(addUser(data));
    if (email) await fetchData(data);
  };

  const fetchData = async (data) => {
    setLoading(true); // Start loading
    try {
      const res = await fetch(API_URL + "/addCustomer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        console.error(`Error: ${res.status} - ${res.statusText}`);
        return;
      }
      const ans = await res.json();
      if (res.ok) {
        navigation.pop();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="bg-bgColor h-[100%]" >
        <View className="bg-BlueColor h-[50px] flex-row items-center p-2">
          <TouchableOpacity className="mr-6" onPress={() => navigation.pop()}>
            <BackArrow />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-white">Add Customer</Text>
        </View>

        <View className="p-2 px-4">
          <Text className="text-white text-lg">Name</Text>
          <TextInput
            editable
            value={text}
            placeholder=""
            onChangeText={(text) => setText(text)}
            className="border-b-2 border-b-[#3A81F1] h-10 text-white text-lg"
          ></TextInput>
        </View>

        {error.length > 0 && (
          <View className="p-2 mt-2">
            <Text className="text-yellow-600">{error}</Text>
          </View>
        )}

        {showButton && (
          <View className="absolute bottom-12 w-[100%] mb-6">
            <TouchableOpacity
              className="my-2 mx-8 border-slate-400 border border-b-2 rounded-md px-2 py-2 bg-BlueColor"
              onPress={() => handleClick()}
              disabled={loading} // Disable button while loading
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" /> // Show ActivityIndicator while loading
              ) : (
                <Text className="text-center text-white text-lg font-semibold">
                  Confirm
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddUser;

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
  },
});
