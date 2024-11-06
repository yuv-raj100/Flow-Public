import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import Rupee from '../svgs/Rupee';
import { useNavigation } from '@react-navigation/native';

const h = Dimensions.get("window").height;
const w = Dimensions.get("window").width;

const PersonEntry = ({name, isDue, amount, date, customerId, email, reminder}) => {

  const navigation = useNavigation();

  return (
    <View>
      <TouchableOpacity
        style={{ padding: h * 0.01, marginVertical: h * 0.008 }}
        className="flex-row justify-between"
        onPress={() =>
          navigation.push("UserScreen", { username: name, customerId, email })
        }
      >
        <View className="flex-row">
          <View
            style={{ width: h * 0.05, height: h * 0.05 }}
            className="rounded-full w-12 h-12 justify-center items-center bg-white mt-1"
          >
            <Text
              style={{ fontSize: Math.floor(h * 0.03) }}
              className="font-bold"
            >
              {name.toUpperCase()[0]}
            </Text>
          </View>
          <View className="ml-2 ">
            <Text
              style={{ fontSize: Math.floor(h * 0.022) }}
              className="mb-2 text-white font-bold"
            >
              {name}
            </Text>
            <Text
              style={{ fontSize: Math.floor(h * 0.018) }}
              className="text-white "
            >
              {reminder === "NA"
                ? "Start transaction"
                : `Last Due: ${reminder}`}
            </Text>
          </View>
        </View>

        <View className="items-end pt-2 ">
          <Text
            style={{ fontSize: Math.floor(h * 0.018) }}
            className={!isDue ? "text-GreenColor" : "text-red-600"}
          >
            ₹ {Math.abs(Number(amount))}
          </Text>
          <Text
            style={{ fontSize: Math.floor(h * 0.015) }}
            className="text-gray-500 "
          >
            {isDue ? "Due" : "Advance"}
          </Text>
        </View>
      </TouchableOpacity>
      <View
        style={{
          borderBottomColor: "#3A81F1",
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />
    </View>
  );
}

export default PersonEntry