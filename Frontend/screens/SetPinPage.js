import { StyleSheet, Text, View, StatusBar, Keyboard } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { VirtualKeyboard } from "react-native-screen-keyboard";
import { OtpInput } from "react-native-otp-entry";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SetPinPage = () => {
  // State to store the typed text
  const [typedText, setTypedText] = useState("");
  const [error, setError] = useState("");

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

  const navigation = useNavigation();

  const setPIN = async () => {
    try {
      await AsyncStorage.setItem("userPIN", typedText);
    } catch (error) {
      console.error("Error saving userPIN", error);
    }
  };

  const handleClick = async () => {
    if (typedText.length < 4) {
      setError("Enter full PIN");
      return;
    }
    setPIN();
    navigation.pop();
  };

  //   const handleKeyDown = (key) => {
  //     console.log("Key pressed: ", key);
  //   };

  //   const handleChange = (fullString) => {
  //     console.log("Current text: ", fullString);
  //     setTypedText(fullString);
  //   };

  return (
    <View className="bg-bgColor h-[100%]">
      <View className="items-center mt-20">
        <Text className="text-white text-2xl font-bold ">
            Enter new PIN
        </Text>
      </View>
    
      <View className="mt-20 px-16">
        <OtpInput
          numberOfDigits={4}
          onTextChange={(typedText) => setTypedText(typedText)}
          theme={{
            containerStyle: styles.container,
            pinCodeContainerStyle: styles.pinCodeContainer,
            pinCodeTextStyle: styles.pinCodeText,
            focusStickStyle: styles.focusStick,
            focusedPinCodeContainerStyle: styles.activePinCodeContainer,
          }}
        />
      </View>

      <View className="items-center mt-2">
        {error.length > 0 && (
          <Text className="text-white text-md text-red-400">*{error}</Text>
        )}
      </View>

      {showButton && <View className="absolute bottom-12 w-[100%]">
        <TouchableOpacity
          className="my-2 mx-8 border-slate-400 border border-b-2 rounded-md  px-2 py-2 bg-BlueColor"
          onPress={() => handleClick()}
        >
          <Text className="text-center text-white text-lg font-semibold">
            Confirm
          </Text>
        </TouchableOpacity>
      </View>}

      {/* <View className="absolute bottom-7 right-0 border-2  w-[100%]">
        <VirtualKeyboard
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          onPressFunction="onPress" // You can customize this based on your need
          vibration={true}
        />
      </View> */}
    </View>
  );
};

export default SetPinPage;

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
  },
  pinCodeText: {
    color: "white",
  },
});
