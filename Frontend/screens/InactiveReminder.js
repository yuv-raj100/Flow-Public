import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import ReminderEntry from "./ReminderEntry";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const InactiveReminder = () => {

  const reminderList = useSelector((store) => store.reminderList.items);

  const dispatch = useDispatch();

  const renderTransaction = ({ item }) =>
    !item.isActive && (
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

  return (
    <View className="mt-3 mb-20">
      <FlatList
        data={reminderList} // Data to be rendered
        renderItem={renderTransaction} // Render each item
        keyExtractor={(item, index) => index.toString()} // Ensure unique keys
      />
    </View>
  );
};

export default InactiveReminder;

const styles = StyleSheet.create({});
