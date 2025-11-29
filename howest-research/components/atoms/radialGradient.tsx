import { View, StyleSheet } from "react-native";
import Svg, { Defs, RadialGradient, Stop, Ellipse } from "react-native-svg";
import { Colors, Fonts } from "@/constants/theme";


const RadialGradientComponent = ({ width = 150, height = 342, rotate = '46.149deg' }) => {
    const ratio = 1.5;

    const cx = width / 2;
    const cy = height / 2;

    const maxRx = cx;
    const maxRy = cy;

    // Calculate radii that maintain the ratio and fit in container
    const ry = Math.min(maxRy, maxRx / ratio);
    const rx = ry * ratio;

    return (
        <View style={[styles.container, { width, height }]}>
            <Svg
                height={height}
                width={width}
                style={{ transform: [{ rotate: rotate }] }}
            >
                <Defs>
                    <RadialGradient
                        id="grad"
                        cx={cx}
                        cy={cy}
                        rx={rx}
                        ry={ry}
                        fx={cx}
                        fy={cy}
                        gradientUnits="userSpaceOnUse"
                    >
                        <Stop offset="0" stopColor="rgb(153, 142, 189)" stopOpacity="0.8" />
                        <Stop offset="1" stopColor="rgb(255, 255, 255)" stopOpacity="0.5" />
                    </RadialGradient>
                </Defs>
                <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#grad)" />
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        overflow: 'hidden',
    },
});

export default RadialGradientComponent;