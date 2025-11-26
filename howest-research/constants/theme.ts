/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const white = '#ffffff';
const black = '#000000';

const blue100 = '#44C8F5';
const blue80 = '#7CC9EE';
const blue50 = '#ADDAF6';
const blue25 = '#D4EDFB';
const blue10 = '#EFF8FE';

const pink100 = '#E6007E';
const pink80 = '#EF5592';
const pink50 = '#F693B9';
const pink25 = '#F8C6D9';
const pink10 = '#FCE8EF';

const yellow100 = '#FFFF00';
const yellow80 = '#FFEF37';
const yellow50 = '#FFF58A';
const yellow25 = '#FFFBC2';
const yellow10 = '#FFFFE6';

const green100 = '#009A93';
const green80 = '#05A59B';
const green50 = '#76C1BA';
const green25 = '#BADEDB';
const green10 = '#E3F1EF';

const purple100 = '#998EBD';
const purple80 = '#ABA0C8';
const purple50 = '#C8BFDD';
const purple25 = '#E1DCEB';
const purple10 = '#F2F1F8';



export const Colors = {
  light: {
    white: white,
    black: black,

    blue100: blue100,
    blue80: blue80,
    blue50: blue50,
    blue25: blue25,
    blue10: blue10,

    pink100: pink100,
    pink80: pink80,
    pink50: pink50,
    pink25: pink25,
    pink10: pink10,

    yellow100: yellow100,
    yellow80: yellow80,
    yellow50: yellow50,
    yellow25: yellow25,
    yellow10: yellow10,

    green100: green100,
    green80: green80,
    green50: green50,
    green25: green25,
    green10: green10,

    purple100: purple100,
    purple80: purple80,
    purple50: purple50,
    purple25: purple25,
    purple10: purple10,
  },
  dark: {
    white: white,
    black: black,

    blue100: blue100,
    blue80: blue80,
    blue50: blue50,
    blue25: blue25,
    blue10: blue10,

    pink100: pink100,
    pink80: pink80,
    pink50: pink50,
    pink25: pink25,
    pink10: pink10,

    yellow100: yellow100,
    yellow80: yellow80,
    yellow50: yellow50,
    yellow25: yellow25,
    yellow10: yellow10,

    green100: green100,
    green80: green80,
    green50: green50,
    green25: green25,
    green10: green10,

    purple100: purple100,
    purple80: purple80,
    purple50: purple50,
    purple25: purple25,
    purple10: purple10,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
