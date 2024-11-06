import * as React from "react";
import Svg, { Path, Circle } from "react-native-svg";
const AddCustomer = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="#3A81F1"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="lucide lucide-user-round-plus"
    {...props}
  >
    <Path d="M2 21a8 8 0 0 1 13.292-6" />
    <Circle cx={10} cy={8} r={5} />
    <Path d="M19 16v6M22 19h-6" />
  </Svg>
);
export default AddCustomer;
