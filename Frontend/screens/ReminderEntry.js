import { View, Text, Switch, Dimensions } from 'react-native'
import React, {useState} from 'react'
import { useDispatch } from "react-redux";
import { toggleReminder } from '../utils/reminderSlice';
import { API_URL } from "@env";
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const h = Dimensions.get("window").height;

const ReminderEntry = ({isReceived, amount, desc, createdOn,reminderDate, billDate, transactionId, username, customerId, isActive}) => {

  const navigation = useNavigation();

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
  //console.log(transactionId)

  const [active, setActive] = useState(!isActive);
  const toggleSwitch = async () => {
    dispatch(toggleReminder(transactionId));
    fetchData();
    setActive((previousState) => !previousState);
  }

  const dispatch = useDispatch();

  return (
    <View>
      <TouchableOpacity
        onPress={() =>
          navigation.push("ReminderDetails", {
            amount,
            isReceived,
            desc,
            reminderDate,
            billDate,
            username,
            isActive,
            transactionId,
          })
        }
      >
        <View className="bg-gray-800 m-1 px-2 py-1 mt-2 rounded-lg">
          <View className="flex-row justify-between items-center">
            <Text
              style={{ fontSize: Math.floor(h * 0.025) }}
              className="text-BlueColor font-semibold"
            >
              {username}
            </Text>
            <Text
              style={{ fontSize: Math.floor(h * 0.019) }}
              className="text-white"
            >
              {reminderDate}
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text
                style={{ fontSize: Math.floor(h * 0.02) }}
                className=" text-white"
              >
                You {isReceived ? "Pay" : "Get"} :{" "}
              </Text>
              <Text
                style={{ fontSize: Math.floor(h * 0.02) }}
                className={`${
                  isReceived ? "text-GreenColor" : "text-red-600"
                } text-lg mt-1`}
              >
                ₹ {amount}
              </Text>
            </View>
            <View>
              <Switch
                trackColor={{ false: "#767577", true: "#3A81F1" }}
                thumbColor={active ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={active}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default ReminderEntry