import * as React from "react";
import Svg, { Path, Rect } from "react-native-svg";
const PageIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="#ffffff"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="lucide lucide-notepad-text"
    {...props}
  >
    <Path d="M8 2v4M12 2v4M16 2v4" />
    <Rect width={16} height={18} x={4} y={4} rx={2} />
    <Path d="M8 10h6M8 14h8M8 18h5" />
  </Svg>
);
export default PageIcon;
