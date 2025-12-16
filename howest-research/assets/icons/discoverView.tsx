import { Colors } from "@/constants/theme"
import * as React from "react"
import Svg, { Path } from "react-native-svg"

const DiscoverViewIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={26}
        height={26}
        fill="none"
        {...props}
    >
        <Path
            stroke={Colors.black}
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 13.358H3.17a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2h5.858a2 2 0 0 1 2 2v4M19.5 13.358h3.33a2 2 0 0 0 2-2V5.5a2 2 0 0 0-2-2h-5.858a2 2 0 0 0-2 2v4"
        />
        <Path
            stroke={Colors.black}
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.547 9.684a2 2 0 0 0-2 2V20.5a2 2 0 0 0 2 2h8.816a2 2 0 0 0 2-2v-8.816a2 2 0 0 0-2-2H8.547Z"
        />
    </Svg>
)
export default DiscoverViewIcon
