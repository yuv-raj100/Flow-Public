import * as React from "react";
import Svg, { Path } from "react-native-svg";
const BackArrow = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="white"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="lucide lucide-arrow-left"
    {...props}
  >
    <Path d="m12 19-7-7 7-7M19 12H5" />
  </Svg>
);
export default BackArrow;
