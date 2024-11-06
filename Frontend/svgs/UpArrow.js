import * as React from "react";
import Svg, { Path } from "react-native-svg";
const DownArrow = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    stroke="#dc2626"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="lucide lucide-move-up"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path d="m8 6 4-4 4 4M12 2v20" />
  </Svg>
);
export default DownArrow;
