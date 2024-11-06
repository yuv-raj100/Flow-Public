import { View, Text, StatusBar, StyleSheet, TouchableOpacity, TextInput, FlatList, ActivityIndicator, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import AddCustomer from '../svgs/addCustomer';
import PersonEntry from './PersonEntry';
import User from '../svgs/User';
import SearchIcon from '../svgs/Search';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setUsers } from "../utils/usersSlice";
import { useFocusEffect } from '@react-navigation/native'; 
import { API_URL } from "@env";


const h = Dimensions.get("window").height;

const Ledger = () => {


  const dispatch = useDispatch();
  // const [email, setEmail] = useState("");
  const email = "raj@123"

  const url = API_URL+"/getCustomer"
  // console.log(url)

  const [filterData,setFilterData] = useState([]);
  const [blank, setBlank] = useState(false);

  const userList = useSelector((store) => store.userList.items);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const urlWithParams = `${
            API_URL + "/getCustomer"
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
          const ans = await res.json();
          const customers = Array.isArray(ans.customers) ? ans.customers : [];
          for (var i = 0; i < customers.length; i++) {
            total += Number(customers[i].amount);
          }
          if(customers.length==0){
            setBlank(true);
          }
          setTotalAmount(total);
          dispatch(setUsers(customers));
          setFilterData(customers);
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
      var total = 0; 
    }, [])
  );

  const handleChange = (text)=>{
    if(text == ""){
      setFilterData(userList);
    }
    else{
      let tempList = userList.filter((item)=>{
        return item.customerName.toLowerCase().indexOf(text.toLowerCase())>-1;
      })
      setFilterData(tempList);
    }
    setText(text);
  }

  const [text,setText] = useState("");
  const navigation = useNavigation();

  // console.log(userList);

  const [totalAmount, setTotalAmount] = useState(0);

  const renderUser = ({ item }) => (
    <PersonEntry
      name={item.customerName}
      isDue={item.isDue}
      amount={item.amount}
      date={item.date}
      customerId={item._id}
      email={email}
      reminder={item.reminder}
    />
  );
  

  return (
    <View className="bg-bgColor h-[100%]">
      <View className="p-1 mt-2 flex-row justify-between items-center">
        <TextInput
          editable
          value={text}
          placeholder="Search User"
          onChangeText={(text) => handleChange(text)}
          className="text-white font-semibold bg-gray-800 h-10 rounded-lg p-2 w-[100%]"
          selectionColor={"white"}
          placeholderTextColor="#6b7280"
        ></TextInput>
        <View className="absolute right-4">
          <SearchIcon />
        </View>
      </View>

      <View className="p-2 flex-row justify-between items-center bg-gray-800 m-1 mt-2 rounded-lg">
        <View>
          <Text
            style={{ fontSize: Math.floor(h * 0.025) }}
            className="text-lg font-bold text-BlueColor mb-1"
          >
            Net Balance
          </Text>
          <Text
            style={{ fontSize: Math.floor(h * 0.016) }}
            className="items-center text-BlueColor text-[12px]"
          >
            {" "}
            {userList.length} Accounts
          </Text>
        </View>

        <View className="items-end">
          <Text
            style={{ fontSize: Math.floor(h * 0.022) }}
            className="text-BlueColor text-lg"
          >
            {" "}
            ₹ {Math.abs(Number(totalAmount))}
          </Text>
          <Text
            style={{ fontSize: Math.floor(h * 0.017) }}
            className="text-BlueColor text-[12px]"
          >
            You {totalAmount < 0 ? "Pay" : "Get"}
          </Text>
        </View>
      </View>

      {filterData.length == 0 ? (
        !blank ? (
          <View style={styles.activityStyle}>
            <ActivityIndicator size="large" color="#47CF73" />
          </View>
        ) : (
          <View
            className="justify-center items-center mt-20"
          >
            <Text className="font-bold text-xl text-slate-400">
              Start your digital ledger
            </Text>
          </View>
        )
      ) : (
        <View className="pb-[160px] ">
          <FlatList
            data={filterData}
            renderItem={renderUser}
            keyExtractor={(user, index) => index.toString()}
          />
          <View
            style={{
              borderBottomColor: "#3A81F1",
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
        </View>
      )}

      <View className="items-end pr-4 absolute " style={styles.addUserStyle}>
        <TouchableOpacity
          className="rounded-full p-4 bg-white w-14 items-center"
          onPress={() => navigation.push("AddUser")}
        >
          <AddCustomer />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Ledger


const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
  },
  activityStyle: {
    flex: 1,
    marginTop: h*0.25,
  },

  addUserStyle:{
    top:h*0.84,
    right:h*0.005
  }
});