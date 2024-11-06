import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import ReminderEntry from "./ReminderEntry";
import { useSelector, useDispatch } from "react-redux";
import { Picker as SelectPicker } from "@react-native-picker/picker"; // Alias the Picker as SelectPicker
import { sortReminders } from "../utils/reminderSlice"; // Import the sortReminders action

const h = Dimensions.get("window").height;
const w = Dimensions.get("window").width;

const ActiveReminder = () => {
  const reminderList = useSelector((store) => store.reminderList.items);
  const dispatch = useDispatch();
  const [sortOrder, setSortOrder] = useState("none");
  const [selectedMonth, setSelectedMonth] = useState("none");

  const renderTransaction = ({ item }) =>
    item.isActive && (
      <ReminderEntry
        amount={item.amount}
        createdOn={item.createdOn}
        desc={item.desc}
        isReceived={item.isReceived}
        transactionId={item._id}
        billDate={item.date}
        reminderDate={item.reminderDate}
        username={item.customerName}
        customerId={item.customerId}
        isActive={item.isActive}
      />
    );

  const onSortPress = (order) => {
    setSortOrder(order);
    dispatch(sortReminders(order)); // Dispatch action to sort the reminder list
  };

  const applyFilter = (month) => {
    setSelectedMonth(month);
  };

  const getFilteredReminders = () => {
    if (selectedMonth === "none") return reminderList;

    return reminderList.filter((item) => {
      const itemMonth = item.date.split("-")[1]; // Extract month from date
      return itemMonth === selectedMonth; // Compare with selected month
    });
  };

  const filteredReminders = getFilteredReminders();

  return (
    <View className="mt-3 mb-40">
      <View className="flex-row justify-between mx-auto mb-3">
        {/* Sort Dropdown */}
        <View style={{ padding: 5 }}>
          <SelectPicker
            selectedValue={sortOrder}
            onValueChange={(itemValue) => onSortPress(itemValue)}
            style={{
              width: 160,
              backgroundColor: "#3A81F1",
              color: "white",
              fontSize: 10,
            }}
          >
            <SelectPicker.Item label="Sort by" value="none" />
            <SelectPicker.Item label="Increasing" value="increasing" />
            <SelectPicker.Item label="Decreasing" value="decreasing" />
          </SelectPicker>
        </View>

        {/* Month Filter Dropdown */}
        <View style={{ padding: 5 }}>
          <SelectPicker
            selectedValue={selectedMonth}
            onValueChange={(itemValue) => applyFilter(itemValue)}
            style={{
              width: 160,
              backgroundColor: "#34A853",
              color: "white",
            }}
          >
            <SelectPicker.Item label="Month" value="none" />
            <SelectPicker.Item label="January" value="01" />
            <SelectPicker.Item label="February" value="02" />
            <SelectPicker.Item label="March" value="03" />
            <SelectPicker.Item label="April" value="04" />
            <SelectPicker.Item label="May" value="05" />
            <SelectPicker.Item label="June" value="06" />
            <SelectPicker.Item label="July" value="07" />
            <SelectPicker.Item label="August" value="08" />
            <SelectPicker.Item label="September" value="09" />
            <SelectPicker.Item label="October" value="10" />
            <SelectPicker.Item label="November" value="11" />
            <SelectPicker.Item label="December" value="12" />
          </SelectPicker>
        </View>
      </View>

      {filteredReminders.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 40 }} className='text-xl text-white'>No reminders!</Text>
      ) : (
        <FlatList
          data={filteredReminders}
          renderItem={renderTransaction}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

export default ActiveReminder;

const styles = StyleSheet.create({});
