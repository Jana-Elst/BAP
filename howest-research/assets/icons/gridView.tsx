import * as React from "react"
import Svg, { Mask, Path, G } from "react-native-svg"
import { Colors } from "@/constants/theme"

const GridViewIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={26}
        height={26}
        fill="none"
        {...props}
    >
        <Mask
            id="a"
            width={26}
            height={26}
            x={0}
            y={0}
            maskUnits="userSpaceOnUse"
            style={{
                maskType: "alpha",
            }}
        >
            <Path fill="#D9D9D9" d="M0 0h26v26H0z" />
        </Mask>
        <G mask="url(#a)">
            <Path
                fill={Colors.black}
                d="M4 11.55a2 2 0 0 1-2-2V3.5a2 2 0 0 1 2-2h6.05a2 2 0 0 1 2 2v6.05a2 2 0 0 1-2 2H4Zm.233-3.234a1 1 0 0 0 1 1h3.583a1 1 0 0 0 1-1V4.733a1 1 0 0 0-1-1H5.233a1 1 0 0 0-1 1v3.583ZM4 23.832a2 2 0 0 1-2-2v-6.05a2 2 0 0 1 2-2h6.05a2 2 0 0 1 2 2v6.05a2 2 0 0 1-2 2H4Zm.233-3.233a1 1 0 0 0 1 1h3.583a1 1 0 0 0 1-1v-3.583a1 1 0 0 0-1-1H5.233a1 1 0 0 0-1 1v3.583Zm12.05-9.05a2 2 0 0 1-2-2V3.5a2 2 0 0 1 2-2h6.049a2 2 0 0 1 2 2v6.05a2 2 0 0 1-2 2h-6.05Zm.233-3.233a1 1 0 0 0 1 1h3.583a1 1 0 0 0 1-1V4.733a1 1 0 0 0-1-1h-3.583a1 1 0 0 0-1 1v3.583Zm-.234 15.516a2 2 0 0 1-2-2v-6.05a2 2 0 0 1 2-2h6.05a2 2 0 0 1 2 2v6.05a2 2 0 0 1-2 2h-6.05Zm.234-3.233a1 1 0 0 0 1 1h3.583a1 1 0 0 0 1-1v-3.583a1 1 0 0 0-1-1h-3.583a1 1 0 0 0-1 1v3.583Z"
            />
        </G>
    </Svg>
)
export default GridViewIcon
