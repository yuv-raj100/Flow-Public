import * as React from "react";
import Svg, { Path } from "react-native-svg";
const Rupee = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="#47CF73"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="lucide lucide-indian-rupee"
    {...props}
  >
    <Path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3M9 13c6.667 0 6.667-10 0-10" />
  </Svg>
);
export default Rupee;
