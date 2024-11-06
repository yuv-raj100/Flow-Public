import { View, Text, TouchableOpacity, StatusBar, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import UpArrow from '../svgs/UpArrow';
import DownArrow from '../svgs/DownArrow';
import { useNavigation } from '@react-navigation/native';
const h = Dimensions.get("window").height;
const w = Dimensions.get("window").width;

const Transaction = ({isReceived, amount, desc, createdOn,reminderDate, billDate, transactionId, username, customerId,email}) => {

  const date = new Date(createdOn);
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const navigation = useNavigation();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; 
 
  const formattedTime = `${hours}:${minutes} ${ampm}`;
  // console.log(w);
    
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("TransactionDetails", {
          isReceived,
          amount,
          desc,
          transactionId,
          username,
          customerId,
          email,
          desc,
          reminderDate,
          billDate,
          createdOn,
        })
      }
    >
      <View className={`m-2 items-${isReceived ? "start" : "end"}`}>
        <View style={{ width: Math.floor(w - 170) }}>
          <View className={`border border-yellow-50  rounded-xl p-2`}>
            <View className=" flex-row items-center mb-2 justify-between">
              <View className="flex-row items-center">
                {!isReceived ? <UpArrow /> : <DownArrow />}
                <Text
                  style={{ fontSize: Math.floor(h * 0.023) }}
                  className={`${
                    isReceived ? "text-GreenColor" : "text-red-600"
                  }`}
                >
                  {amount}
                </Text>
              </View>

              <Text
                style={{ fontSize: Math.floor(h * 0.018) }}
                className="text-slate-300 mr-2"
              >
                {formattedTime}
              </Text>
            </View>
            {desc && <Text className="text-slate-300 pl-1">{desc}</Text>}
          </View>
          {/* <View className={`items-end mr-1`}>
            <Text
              style={{ fontSize: Math.floor(h * 0.02) }}
              className={`text-slate-300 ${isReceived ? "ml-1" : "mr-1"}`}
            >
              ₹ {amount} Due
            </Text>
          </View> */}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default Transaction