import { View, Text, StatusBar, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import React, {useState, useEffect} from 'react'
import BackArrow from '../svgs/BackArrow';
import { useNavigation } from '@react-navigation/native';
import { Table, Row, Rows } from "react-native-table-component";
import { useSelector } from "react-redux";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";


const h = Dimensions.get("window").height;
const {w} = Dimensions.get("window");



const TabularView = ({route}) => {

  
    const tableHead= ["Amount", "Description", "Date", "Reminder Date"];
    const [tableData,setTableData]= useState([])


  const transactionList = useSelector((store) => store.transactionList.items);
  
    useEffect(() => {
      const formattedData = transactionList.map((transaction) => [
        "₹ " + transaction.amount,
        transaction.desc,
        transaction.date,
        transaction.reminderDate,
        transaction.isReceived,
      ]);
      setTableData(formattedData);
    }, [transactionList]);

  const navigation = useNavigation();
  const { username, customerId } = route.params;
  const [data, setData] = useState(tableData);
  const widthArr = [w/4, w/4, w/4, w/4 ];

  return (
    <View className="h-[100%] bg-bgColor">
      <View className="flex-row items-center bg-BlueColor p-2 justify-between">
        <View className="flex-row items-center">
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
      </View>
      <ScrollView className="h-80% mb-8">
        <View className="mt-8 mx-2 border-2">
          <Table borderStyle={{ borderWidth: 1, borderColor: "#125B9A" }}>
            <Row
              data={tableHead}
              widthArr={widthArr}
              style={styles.head}
              textStyle={styles.headText}
            />
            {tableData.map((rowData, index) => (
              <Row
                key={index}
                data={rowData.slice(0, 4)} // Displaying first 4 fields: amount, description, date, reminderDate
                style={[
                  rowData[4] ? styles.receivedRow : styles.sentRow, // Conditionally apply background color based on transaction type
                ]}
                widthArr={widthArr}
                textStyle={styles.text}
              />
            ))}
          </Table>
        </View>
      </ScrollView>
    </View>
  );
}

export default TabularView

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
  },
  head: { height: 40, backgroundColor: "#DF826C" },
  headText: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    width:'100%'
  },
//   row: {
//     height: 40,
//   },
  receivedRow: {
    backgroundColor: "#47cf73", // Light green for received transactions
  },
  sentRow: {
    backgroundColor: "#dc2626", // Light red for sent transactions
  },
  text: { margin: 3, fontSize: 9, fontWeight: "bold", textAlign: "center" },
});