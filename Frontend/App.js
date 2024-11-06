import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import IntroPage from './screens/IntroPage';
import HomePage from './screens/HomePage';
import AddUser from './screens/AddUser';
import UserScreen from './screens/UserScreen';
import { Provider } from 'react-redux';
import appStore from './utils/appStore';
import AddTransaction from './screens/AddTransaction';
import LoginPage from './screens/LoginPage';
import TransactionDetails from './screens/TransactionDetails';
import TabularView from './screens/TabularView';
import DeleteUser from './screens/DeleteUser';
import LockPage from './screens/LockPage';
import SetPinPage from './screens/SetPinPage';
import firebase from "@react-native-firebase/app";
import messaging from "@react-native-firebase/messaging";
import { useEffect } from 'react';
import { API_URL } from "@env";
import ReminderDetails from './screens/ReminderDetails';
import * as Device from "expo-device";


const Stack = createNativeStackNavigator();

export default function App() {


  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  }

  async function sendTokenToBackend(token) {
    try {
      await fetch(API_URL+"/registerToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, device:Device.deviceName }), // Send the token as JSON
      });
      console.log("Token sent to backend successfully");
    } catch (error) {
      console.error("Error sending token to backend:", error);
    }
  }

  useEffect(()=>{
    (async () => {
      if (requestUserPermission()) {
        const token = await messaging().getToken();
        console.log("Token:", token);
        sendTokenToBackend(token); // Call the function to send the token
      } else {
        console.log("Permission denied for notifications.");
      }
    })();

    messaging()
      .getInitialNotification()
      .then(async (remoteMessage)=>{
        if(remoteMessage){
          console.log('Notification casued app to open from quit state:',
            remoteMessage.notification,
          );
        }
      });

      messaging().onNotificationOpenedApp(async (remoteMessage)=> {
        console.log('Notification caused app to open from background state:',
          remoteMessage.notification,
        );
      })

      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log("Message handled in the background!", remoteMessage);
      });

      const unsubscribe = messaging().onMessage(async (remoteMessage) => {
          try {
            Alert.alert(remoteMessage.notification.body);
          } catch (error) {
            console.error("Error handling the remote message:", error);
          }      
      });

      return unsubscribe;
  })

  // console.log(Device.deviceName)

  return (
    <Provider store={appStore}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="IntroPage">
          <Stack.Screen
            name="IntroPage"
            component={IntroPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HomePage"
            component={HomePage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddUser"
            component={AddUser}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UserScreen"
            component={UserScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddTransaction"
            component={AddTransaction}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LoginPage"
            component={LoginPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TransactionDetails"
            component={TransactionDetails}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TabularView"
            component={TabularView}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DeleteUser"
            component={DeleteUser}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LockPage"
            component={LockPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SetPIN"
            component={SetPinPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ReminderDetails"
            component={ReminderDetails}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
