import { Colors, Fonts } from "@/constants/theme";
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text } from "react-native";

const lineHeight = (fontSize: number, multiplier: number = 1) => {
    return Math.round(fontSize * multiplier);
}

const StyledText = ({ children, style = null, hasGradient = false, styleGradient = null, numberOfLines = undefined, ...props }: any) => {
    if (hasGradient) {
        return (
            <LinearGradient
                colors={[Colors.blue100, Colors.blue25, Colors.blue100]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styleGradient}
            >
                <Text style={[styles.paragraph, style, { flexShrink: 1 }]} numberOfLines={numberOfLines} {...props}>{children}</Text>
            </LinearGradient>)
    } else {
        return <Text style={[styles.paragraph, style, { flexShrink: 1 }]} numberOfLines={numberOfLines} {...props}>{children}</Text>
    }
};

const Title = ({ children, style = null }) => {
    return <Text style={[styles.title, style]}>{children}</Text>
};

const SubTitle = ({ children, style = null }) => {
    return <Text style={[styles.subTitle, style]}>{children}</Text>
};

const Paragraph = ({ children, style = null }) => {
    return <Text style={[styles.paragraph, style]}>{children}</Text>
};

const SubTitleSmall = ({ children, style = null }) => {
    return <Text style={[styles.subTitleSmall, style]}>{children}</Text>
};

const ParagraphSmall = ({ children, style = null }) => {
    return <Text style={[styles.paragraphSmall, style]}>{children}</Text>
};

const ParagraphXSmall = ({ children, style = null }) => {
    return <Text style={[styles.paragraphXSmall, style]}>{children}</Text>
};

const ParagraphLarge = ({ children, style = null }) => {
    return <Text style={[styles.paragraphLarge, style]}>{children}</Text>
};

const TitleXSmall = ({ children, style = null }) => {
    return <Text style={[styles.TitleXSmall, style]}>{children}</Text>
};

const ParagraphBold = ({ children, style = null }) => {
    return <Text style={[styles.paragraphBold, style]}>{children}</Text>
};

export {
    Paragraph, ParagraphBold, ParagraphLarge, ParagraphSmall,
    ParagraphXSmall, StyledText, SubTitle, SubTitleSmall, Title, TitleXSmall
};

const styles = StyleSheet.create({
    paragraph: {
        fontFamily: Fonts.sans.regular,
        fontSize: 20,
        lineHeight: lineHeight(20, 1.4),
    },

    title: {
        fontFamily: Fonts.rounded.bold,
        fontSize: 40,
        lineHeight: lineHeight(40, 1.2),
    },

    subTitle: {
        fontFamily: Fonts.sans.semiBold,
        fontSize: 28,
        lineHeight: lineHeight(20, 1.2),
    },

    subTitleSmall: {
        fontFamily: Fonts.rounded.bold,
        fontSize: 32,
        lineHeight: lineHeight(32, 1.2),
    },

    paragraphSmall: {
        fontFamily: Fonts.sans.regular,
        fontSize: 18,
        lineHeight: lineHeight(18, 1.4),
    },

    paragraphXSmall: {
        fontFamily: Fonts.sans.regular,
        fontSize: 16,
        lineHeight: lineHeight(16, 1.4),
    },

    paragraphLarge: {
        fontFamily: Fonts.sans.regular,
        fontSize: 24,
        lineHeight: lineHeight(24, 1.35),
    },

    TitleXSmall: {
        fontFamily: Fonts.rounded.bold,
        fontSize: 24,
        lineHeight: lineHeight(24, 1.4),
    },

    paragraphBold: {
        fontFamily: Fonts.sans.bold,
        fontSize: 20,
        lineHeight: lineHeight(20, 1.4),
    }
});