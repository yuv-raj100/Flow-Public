import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "@env";


const LoginPage = ({ route }) => {
  const { isLogin } = route.params;
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("*Please provide all info !");

  const endpoint = !isLogin ? "register" : "login";
  const url = API_URL+`/${endpoint}`;

  const setUserEmail = async () => {
    try {
      await AsyncStorage.setItem("user", email);
    } catch (error) {
      console.error("Error saving group name", error);
    }
  };

  const fetchData = async (data) => {
    try {
      const res = await fetch(API_URL + `/${endpoint}`, {
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
        setUserEmail();
        navigation.push("HomePage");
      } else {
        console.log(ans.message);
        setError(ans.message);
        setShowError(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async () => {
    if (!email || !password) {
      setName("");
      setEmail("");
      setPassword("");
      setError("*Please provide all info !");
      setShowError(true);
      return;
    }
    const data = {
      username: name,
      email: email,
      password: password,
    };
    await fetchData(data);

    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <View style={styles.container} className="bg-bgColor p-2 px-4 h-[100%]">
      <Text className="text-white text-xl mt-4">
        {!isLogin ? "Welcome to Raj Finance!" : "Welcome back to Raj Finance!"}
      </Text>
      <View className="mt-4">
        <Text className="text-white text-lg">Email Address</Text>
        <TextInput
          editable
          value={email}
          placeholder=""
          onChangeText={(text) => setEmail(text)}
          className="border-b-2 border-b-[#3A81F1] h-8 text-white"
        ></TextInput>
      </View>
      {!isLogin && (
        <View className="mt-4">
          <Text className="text-white text-lg">Username</Text>
          <TextInput
            editable
            value={name}
            placeholder=""
            onChangeText={(text) => setName(text)}
            className="border-b-2 border-b-[#3A81F1] h-8 text-white"
          ></TextInput>
        </View>
      )}
      <View className="mt-4">
        <Text className="text-white text-lg">Password</Text>
        <TextInput
          editable
          value={password}
          placeholder=""
          onChangeText={(text) => setPassword(text)}
          className="border-b-2 border-b-[#3A81F1] h-8 text-white"
        ></TextInput>
      </View>
      {showError && (
        <View>
          <Text className="text-orange-400 mt-6 text-lg">{error}</Text>
        </View>
      )}
      <View className="absolute bottom-16 w-full ml-4">
        <TouchableOpacity
          className="my-2 mx-8 border-slate-400 border border-b-2 rounded-md"
          onPress={() => handleClick()}
        >
          <View
            className={`bg-${
              isLogin ? "bgColor" : "[#47CF73]"
            }  px-2 py-4 rounded-md`}
          >
            <Text className="text-center text-white text-lg font-semibold">
              {isLogin ? "Log in" : "Sign up"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
  },
});
