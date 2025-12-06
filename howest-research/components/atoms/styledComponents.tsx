import { Colors, Fonts } from "@/constants/theme";
import { Text, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const StyledText = ({ children, style = null, hasGradient = false, styleGradient = null }) => {
    if (hasGradient) {
        return (
            <LinearGradient
                colors={[Colors.blue100, Colors.blue25, Colors.blue100]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styleGradient}
            >
                <Text style={[styles.paragraph, style]}>{children}</Text>
            </LinearGradient>)
    } else {
        return <Text style={[styles.paragraph, style]}>{children}</Text>
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
    StyledText,
    Title,
    SubTitle,
    Paragraph,
    SubTitleSmall,
    ParagraphSmall,
    ParagraphLarge,
    TitleXSmall,
    ParagraphBold
};

const styles = StyleSheet.create({
    paragraph: {
        fontFamily: Fonts.sans.regular,
        fontSize: 20,
        // lineHeight: 1.4,
    },

    title: {
        fontFamily: Fonts.rounded.bold,
        fontSize: 40,
        // lineHeight: 1.2,
    },

    subTitle: {
        fontFamily: Fonts.sans.semiBold,
        fontSize: 28,
        // lineHeight: ,
    },

    subTitleSmall: {
        fontFamily: Fonts.rounded.bold,
        fontSize: 32,
        // lineHeight: 1.2,
    },

    paragraphSmall: {
        fontFamily: Fonts.sans.regular,
        fontSize: 18,
        // lineHeight: 1.4,
    },

    paragraphLarge: {
        fontFamily: Fonts.sans.regular,
        fontSize: 24,
        // lineHeight: 1.35,
    },

    TitleXSmall: {
        fontFamily: Fonts.rounded.bold,
        fontSize: 24,
        // lineHeight: 1.4,
    },

    paragraphBold: {
        fontFamily: Fonts.sans.bold,
        fontSize: 20,
        // lineHeight: 1.4,
    }
});