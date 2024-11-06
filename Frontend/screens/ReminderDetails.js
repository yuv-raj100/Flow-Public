import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Dimensions,
  Switch
} from "react-native";
import React,{useState} from "react";
import BackArrow from "../svgs/BackArrow";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { toggleReminder } from "../utils/reminderSlice";
import { API_URL } from "@env";

const h = Dimensions.get("window").height;

const ReminderDetails = ({route }) => {
  const navigation = useNavigation();
  const { isReceived, amount, username, desc, reminderDate, billDate, isActive, transactionId  } = route.params
  // console.log(reminderDate);

   const fetchData = async () => {
     try {
       const urlWithParams = `${
         API_URL + "/toggleReminder"
       }?tId=${encodeURIComponent(transactionId)}`;
       const res = await fetch(urlWithParams, {
         method: "GET",
         headers: {
           "Content-Type": "application/json",
         },
       });
       if (!res.ok) {
         console.error(`Error: ${res.status} - ${res.statusText}`);
         return;
       }
       const ans = await res.json();
     } catch (error) {
       console.log(error);
     }
   };

   const [active, setActive] = useState(!isActive);
   const toggleSwitch = async () => {
     dispatch(toggleReminder(transactionId));
     fetchData();
     setActive((previousState) => !previousState);
   };

   const dispatch = useDispatch();

  // console.log(transactionId);

  return (
    <View  className="bg-bgColor h-[100%]">
      <View className="flex-row items-center bg-BlueColor p-2">
        <TouchableOpacity className="mr-2" onPress={() => navigation.pop()}>
          <BackArrow />
        </TouchableOpacity>
        <View
          style={{ width: h * 0.05, height: h * 0.05 }}
          className="rounded-full justify-center items-center bg-white  mr-2"
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
          style={{ fontSize: Math.floor(h * 0.05) }}
          className={`${
            isReceived ? "text-GreenColor" : "text-red-600"
          } font-bold`}
        >
          ₹ {amount}
        </Text>
      </View>
      <View style={styles.detailContainer} className="p-4">
        <Text
          style={{ fontSize: Math.floor(h * 0.025) }}
          className="text-slate-400"
        >
          Description:
        </Text>
        <Text
          style={{ fontSize: Math.floor(h * 0.022) }}
          className="text-white mb-4"
        >
          {desc || "No description provided"}
        </Text>

        <Text
          style={{ fontSize: Math.floor(h * 0.025) }}
          className="text-slate-400 "
        >
          Bill Date:{" "}
        </Text>
        <Text
          style={{ fontSize: Math.floor(h * 0.022) }}
          className="text-white mb-4"
        >
          {billDate}
        </Text>

        <Text
          style={{ fontSize: Math.floor(h * 0.025) }}
          className="text-slate-400 "
        >
          Reminder Date:
        </Text>
        <Text
          style={{ fontSize: Math.floor(h * 0.022) }}
          className="text-white "
        >
          {reminderDate}
        </Text>
      </View>
      <View className="flex-row items-center m-2 p-1">
        <Text className="mr-auto text-slate-400 text-lg">Completed</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#3A81F1" }}
          thumbColor={active ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={active}
        />
      </View>
    </View>
  );
};

export default ReminderDetails;

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
  },
});
