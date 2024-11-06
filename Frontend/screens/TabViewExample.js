import * as React from "react";
import { View, useWindowDimensions, Dimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import ActiveReminder from "./ActiveReminder";
import InactiveReminder from "./InactiveReminder";

const h = Dimensions.get("window").height;

const renderScene = SceneMap({
  first: ActiveReminder,
  second: InactiveReminder,
});

export default function TabViewExample() {

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Active" },
    { key: "second", title: "Inactive" },
  ]);

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "#212121" }}
      //tabStyle={{ borderWidth: 1, borderColor: 'lightgreen',}}
      // labelStyle={{ color: 'lightgreen' }}
      style={{ backgroundColor: "#212121", textAlign: "left", }}
      activeColor="#47CF73"
      indicatorContainerStyle={{ backgroundColor: "#212121",  }}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={renderTabBar}
      initialLayout={{ width: layout.width }}
    />
  );
}
