import { View, Text, StyleSheet, StatusBar, FlatList, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import ReminderEntry from './ReminderEntry';
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setReminder } from '../utils/reminderSlice';
import TabViewExample from './TabViewExample';
import { API_URL } from "@env";

const h = Dimensions.get("window").height;


const RemindersPage = () => {

  const email="raj@123"
  const url = API_URL+"/getReminders";
  

  const reminderList = useSelector((store) => store.reminderList.items);

  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const urlWithParams = `${
            API_URL + "/getReminders"
          }?email=${encodeURIComponent(email)}`;
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
          //console.log(res);
          const ans = await res.json();
          // console.log(ans);
          const reminders = Array.isArray(ans.reminders) ? ans.reminders : [];
        //   console.log(reminders)
          dispatch(setReminder(reminders));
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    }, []) 
  );


  return (
    <View className="bg-bgColor h-[100%]">
      <View className="bg-BlueColor p-2 ">
        <Text
          style={{ fontSize: Math.floor(h * 0.03) }}
          className="text-white font-bold"
        >
          Reminders
        </Text>
      </View>

      {/* <View className="flex-row justify-center">
        <TouchableOpacity>
          <Text className="bg-white p-3  rounded-md px-auto">
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="bg-white p-3 ml-2 px-2 rounded-md">Inactive</Text>
        </TouchableOpacity>
      </View> */}

      <View style={{ top: h * 0.002, width: "100%", height: "100%" }}>
        <TabViewExample />
      </View>

      {/* <View>
        <FlatList
          data={reminderList} // Data to be rendered
          renderItem={renderTransaction} // Render each item
          keyExtractor={(item, index) => index.toString()} // Ensure unique keys
        />
      </View> */}
    </View>
  );
}

export default RemindersPage

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
  },
});