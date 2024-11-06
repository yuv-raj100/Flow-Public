import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";
const SearchIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="currentColor"
    stroke="#3A81F1"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="lucide lucide-search"
    {...props}
  >
    <Circle cx={11} cy={11} r={8} />
    <Path d="m21 21-4.3-4.3" />
  </Svg>
);
export default SearchIcon;
