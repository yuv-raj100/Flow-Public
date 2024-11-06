import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, {useState, useEffect} from "react";
import LoginButton from "./LoginButton";
import { GoogleSignin, GoogleSigninButton } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { TypeAnimation } from "react-native-type-animation";

const w = Dimensions.get("window").width;
const h = Dimensions.get("window").height;

const IntroPage = () => {


  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    // console.log(user);
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "1880284300-3ao488rg49t1cf7hsfe9j38hvsm5i6ha.apps.googleusercontent.com",  
    });

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const onGoogleButtonPress = async ()=>{
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const signInResult = await GoogleSignin.signIn();
    

    idToken = signInResult.data?.idToken;
    // console.log(idToken);
    if (!idToken) {
      idToken = signInResult.idToken;
    }
    if (!idToken) {
      throw new Error("No ID token found");
    }

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(
      signInResult.data.idToken
    );

    return auth().signInWithCredential(googleCredential);
  }

  const signOut = async ()=>{
    try {
      // const isSignedIn = await GoogleSignin.isSignedIn();
      // console.log(isSignedIn)
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await auth().signOut();
    } catch (error) {
      console.log(error);
    }
  }

  //  console.log(user)

  if(!user){
    return (
      <View className="bg-bgColor h-full items-center justify-center">
        <TypeAnimation
          sequence={[
            { text: "f" },
            { text: "fl" },
            {
              action: () => {
                // console.log("Finished first two sequences");
              },
            },
            { text: "flo" },
            { text: "flow" },
          ]}
          cursor={false}
          loop
          style={{
            color: "white",
            fontSize: 50,
            fontFamily: "monospace",
            fontWeight: "800",
          }}
        />
        <View className='border-2 w-52 items-center'>
          <Text
            className="text-sm text-white "
            style={{ fontFamily: "monospace", letterSpacing: -2 }}
          >
            manage your money flow
          </Text>
        </View>
        {/* <Text>Manage your cash flow</Text> */}
        <View className="px-auto" style={{ marginTop: h * 0.4 }}>
          <GoogleSigninButton
            onPress={onGoogleButtonPress}
            style={{ width: 300, height: 60, fontSize: 30 }}
          />
        </View>
      </View>
    );
  }
  return(
    <View>
      <Text>Welcome,{user.displayName}</Text>
      <TouchableOpacity onPress={signOut}>
        <Text>SignOut</Text>
      </TouchableOpacity>
    </View>
  )
};

export default IntroPage;

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
  },
});
