import { View, Text, StyleSheet, StatusBar } from 'react-native'
import React from 'react'

const ProfilePage = () => {
  return (
    <View  className="bg-bgColor h-[100%] flex-1 justify-center items-center">
      <Text className='text-2xl font-bold text-white'>This page is under construction!</Text>
    </View>
  )
}

export default ProfilePage


const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
  },
});
