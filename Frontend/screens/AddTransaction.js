import { View, Text, TouchableOpacity, StatusBar, StyleSheet, TextInput, Platform, Pressable, Switch, Keyboard, ActivityIndicator, KeyboardAvoidingView, Dimensions} from "react-native";
import React, { useState, useEffect } from "react";
import BackArrow from "../svgs/BackArrow";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useDispatch } from "react-redux";
import { addTransaction } from "../utils/transactionSlice";
import { API_URL } from "@env";

const h = Dimensions.get("window").height

const AddTransaction = ({route}) => {

  const dispatch = useDispatch();

  const {username, Received, customerId, email,} = route.params;
  const navigation = useNavigation();
  const [amount,setAmount] = useState('');
  const [desc,setDesc] = useState("");
  const [remind,setRemind] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [error,setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0'); 
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  })

  const [reminderDate, setReminderDate] = useState(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0'); 
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  })

  const [showButton, setShowButton] = useState(true); // Track button visibility

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setShowButton(false); // Hide button when keyboard is open
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setShowButton(true); // Show button when keyboard is closed
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

   const handleConfirm = (selectedDate) => {
    console.log(selectedDate);
    if(!remind){
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;

      setDate(formattedDate);  
      hideDatePicker();
    }
    else{
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const year = selectedDate.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;

      setReminderDate(formattedDate); 
      hideDatePicker();
      setRemind(false);
    }
  }; 

   const handleClick = async () => {
    if(!amount){
      setError("*Please enter an amount");
      return;
    }
    
    const transaction = {
      customerId,
      createdOn: new Date().toISOString(),
      amount: amount,
      date: date,
      desc: desc,
      customerName:username,
      reminderDate:reminderDate,
      isReceived:Received,
      email,
      remindMe,
    }

    setLoading(true);

    dispatch(
      addTransaction(transaction)
    );
    await fetchData(transaction);
    setLoading(false);
   };

   const url = API_URL+"/addTransaction";

   const fetchData = async (data) => {
     try {
       const res = await fetch(API_URL + "/addTransaction", {
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
     }
   };

  const [remindMe, setRemindMe] = useState(false);
  const toggleSwitch = () => setRemindMe((previousState) => !previousState);

  return (
    <View className="bg-bgColor h-[100%] ">
      <KeyboardAvoidingView behavior={"height"}>
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

        <View className="flex-row items-center justify-center">
          <Text
            className={`${
              Received ? "text-GreenColor" : "text-red-600"
            } text-xl`}
          >
            ₹
          </Text>
          <TextInput
            editable
            value={amount}
            placeholder="0"
            onChangeText={(amount) => setAmount(amount)}
            style={{ fontSize: Math.floor(h * 0.035) }}
            className="border-b-2 border-b-BlueColor h-20 text-white  items-center  px-4"
            keyboardType="numeric"
            placeholderTextColor="#f1f5f9"
          ></TextInput>
        </View>

        {error.length > 0 && (
          <View className="justify-center items-center mt-2">
            <Text className="text-yellow-600">{error}</Text>
          </View>
        )}

        <View
          style={{ marginTop: Math.floor(h * 0.04) }}
          className="border-2 border-slate-200 rounded-xl m-2 items-center  p-2"
        >
          <View style={styles.labelContainer}>
            <Text
              style={{ fontSize: Math.floor(h * 0.02) }}
              className="text-slate-400"
            >
              Entry Date
            </Text>
          </View>
          <View>
            <Pressable onPress={showDatePicker}>
              <TextInput
                placeholder={date}
                value={date}
                editable={false}
                style={{ fontSize: Math.floor(h * 0.022), height: h * 0.045 }}
                className=" text-white"
                placeholderTextColor="#f1f5f9"
              />
            </Pressable>
          </View>
        </View>
        <View
          style={{ marginTop: Math.floor(h * 0.035) }}
          className="border-2 border-slate-200 rounded-xl m-2 items-center  p-2"
        >
          <View style={styles.labelContainer}>
            <Text
              style={{ fontSize: Math.floor(h * 0.02) }}
              className="text-slate-400"
            >
              Reminder Date
            </Text>
          </View>
          <View>
            <Pressable
              onPress={() => {
                showDatePicker(), setRemind(true);
              }}
            >
              <TextInput
                placeholder={reminderDate}
                value={reminderDate}
                editable={false}
                style={{ fontSize: Math.floor(h * 0.022), height: h * 0.045 }}
                className="text-white"
                placeholderTextColor="#f1f5f9"
              />
            </Pressable>
          </View>
        </View>

        <View
          style={{ marginTop: Math.floor(h * 0.035) }}
          className="border-2 border-slate-200 rounded-xl m-2  p-2"
        >
          <View style={styles.labelContainer}>
            <Text
              style={{ fontSize: Math.floor(h * 0.02) }}
              className="text-slate-400"
            >
              Description
            </Text>
          </View>
          <View>
            <TextInput
              placeholder="Add Note (Optional)"
              value={desc}
              editable
              onChangeText={(desc) => setDesc(desc)}
              style={{ fontSize: Math.floor(h * 0.018), height: h * 0.045 }}
              className="h-10 text-white w-full "
              placeholderTextColor="#f1f5f9"
            />
          </View>
        </View>
      </KeyboardAvoidingView>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <View className="flex-row items-center m-2 p-1">
        <Text className="mr-auto text-slate-400 text-lg">Remind Me</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#3A81F1" }}
          thumbColor={remindMe ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={remindMe}
        />
      </View>

      {showButton && (
        <View className="absolute bottom-12 w-[100%]">
          <TouchableOpacity
            className="my-2 mx-8 border-slate-400 border border-b-2 rounded-md  px-2 py-2 bg-BlueColor"
            onPress={() => handleClick()}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text className="text-center text-white text-lg font-semibold">
                Confirm
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default AddTransaction;

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
  },
  labelContainer: {
    backgroundColor: "#212121", // Same color as background
    alignSelf: "flex-start", // Have View be same width as Text inside
    paddingHorizontal: 3, // Amount of spacing between border and first/last letter
    marginStart: 10, // How far right do you want the label to start
    zIndex: 1, // Label must overlap border
    elevation: 1, // Needed for android
    shadowColor: "#212121", // Same as background color because elevation: 1 creates a shadow that we don't want
    position: "absolute", // Needed to be able to precisely overlap label with border
    top: -12, // Vertical position of label. Eyeball it to see where label intersects border.
  },
});