/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const white = '#ffffff';
const black = '#000000';
const textGrey = '#606060';

const blue100 = '#44C8F5';
const blue80 = '#7CC9EE';
const blue50 = '#ADDAF6';
const blue25 = '#D4EDFB';
const blue10 = '#EFF8FE';

const blueText = '#028BB9';
const greenText = '#006561';
const pinkText = '#BA0167';
const yellowText = '#D1C000';
const purpleText = '#60528E';

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

const yellowTextLight = '#D3CA62';

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

const gradientBlueLightStart = 'rgba(68, 200, 245, 0.80)';
const gradientBlueLightEnd = 'rgba(68, 200, 245, 0.00)';

const gradientPurpleLightStart = '#998EBD';
const gradientPurpleLightEnd = 'rgba(153, 142, 189, 0.00)';

const gradientGreenLightStart = 'rgba(0, 154, 147, 0.80)';
const gradientGreenLightEnd = 'rgba(0, 154, 147, 0.00)';

const gradientPinkLightStart = 'rgba(230, 0, 126, 0.50)';
const gradientPinkLightEnd = 'rgba(230, 0, 126, 0.00)';

const gradientYellowLightStart = 'rgba(255, 242, 0, 0.50)';
const gradientYellowLightEnd = 'rgba(255, 242, 0, 0.00)';

const gradientBlueDarkStart = 'rgba(68, 200, 245, 0.10)';
const gradientBlueDarkEnd = 'rgba(68, 200, 245, 0.50)';

const gradientPurpleDarkStart = 'rgba(153, 142, 189, 0.25)';
const gradientPurpleDarkEnd = 'rgba(153, 142, 189, 0.80)';

const gradientGreenDarkStart = 'rgba(0, 154, 147, 0.10)';
const gradientGreenDarkEnd = 'rgba(0, 154, 147, 0.50)';

const gradientPinkDarkStart = 'rgba(230, 0, 126, 0.10)';
const gradientPinkDarkEnd = 'rgba(230, 0, 126, 0.50)';

const gradientYellowDarkStart = 'rgba(255, 242, 0, 0.10)';
const gradientYellowDarkEnd = 'rgba(255, 242, 0, 0.50)';


export const Colors = {
  white: white,
  black: black,
  textGrey: textGrey,

  blue100: blue100,
  blue80: blue80,
  blue50: blue50,
  blue25: blue25,
  blue10: blue10,

  blueText: blueText,
  greenText: greenText,
  pinkText: pinkText,
  yellowText: yellowText,
  purpleText: purpleText,

  blueTextLight: blue80,
  greenTextLight: green50,
  pinkTextLight: pink50,
  yellowTextLight: yellowTextLight,
  purpleTextLight: purple80,

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

  gradientBlueLightStart: gradientBlueLightStart,
  gradientBlueLightEnd: gradientBlueLightEnd,

  gradientGreenLightStart: gradientGreenLightStart,
  gradientGreenLightEnd: gradientGreenLightEnd,

  gradientPinkLightStart: gradientPinkLightStart,
  gradientPinkLightEnd: gradientPinkLightEnd,

  gradientYellowLightStart: gradientYellowLightStart,
  gradientYellowLightEnd: gradientYellowLightEnd,

  gradientPurpleLightStart: gradientPurpleLightStart,
  gradientPurpleLightEnd: gradientPurpleLightEnd,

  gradientBlueDarkStart: gradientBlueDarkStart,
  gradientBlueDarkEnd: gradientBlueDarkEnd,

  gradientGreenDarkStart: gradientGreenDarkStart,
  gradientGreenDarkEnd: gradientGreenDarkEnd,

  gradientPinkDarkStart: gradientPinkDarkStart,
  gradientPinkDarkEnd: gradientPinkDarkEnd,

  gradientYellowDarkStart: gradientYellowDarkStart,
  gradientYellowDarkEnd: gradientYellowDarkEnd,

  gradientPurpleDarkStart: gradientPurpleDarkStart,
  gradientPurpleDarkEnd: gradientPurpleDarkEnd,
};

export const Fonts = Platform.select({
  ios: {
    sans: {
      bold: 'OpenSans-Bold',
      boldItalic: 'OpenSans-Bolditalic',
      ExtraBold: 'OpenSans-Extrabold',
      ExtraBoldItalic: 'OpenSans-Extrabolditalic',
      italic: 'OpenSans-Italic',
      light: 'OpenSans-Light',
      lightItalic: 'OpenSans-Lightitalic',
      regular: 'OpenSans',
      semiBold: 'OpenSans-Semibold',
      semiBoldItalic: 'OpenSans-Semibolditalic',
    },
    rounded: {
      black: 'VAGRoundedStd-Black',
      bold: 'VAGRoundedStd-Bold',
      light: 'VAGRoundedStd-Light',
      thin: 'VAGRoundedStd-Thin',
    }
  },
  android: {
    sans: {
      bold: 'OpenSans-Bold',
      boldItalic: 'OpenSans-Bolditalic',
      ExtraBold: 'OpenSans-Extrabold',
      ExtraBoldItalic: 'OpenSans-Extrabolditalic',
      italic: 'OpenSans-Italic',
      light: 'OpenSans-Light',
      lightItalic: 'OpenSans-Lightitalic',
      regular: 'OpenSans',
      semiBold: 'OpenSans-Semibold',
      semiBoldItalic: 'OpenSans-Semibolditalic',
    },
    rounded: {
      black: 'VAGRoundedStd-Black',
      bold: 'VAGRoundedStd-Bold',
      light: 'VAGRoundedStd-Light',
      thin: 'VAGRoundedStd-Thin',
    }
  },
  default: {
    sans: {
      bold: 'OpenSans-Bold',
      boldItalic: 'OpenSans-Bolditalic',
      ExtraBold: 'OpenSans-Extrabold',
      ExtraBoldItalic: 'OpenSans-Extrabolditalic',
      italic: 'OpenSans-Italic',
      light: 'OpenSans-Light',
      lightItalic: 'OpenSans-Lightitalic',
      regular: 'OpenSans',
      semiBold: 'OpenSans-Semibold',
      semiBoldItalic: 'OpenSans-Semibolditalic',
    },
    rounded: {
      black: 'VAGRoundedStd-Black',
      bold: 'VAGRoundedStd-Bold',
      light: 'VAGRoundedStd-Light',
      thin: 'VAGRoundedStd-Thin',
    }
  },
  web: {
    sans: {
      bold: 'OpenSans-Bold',
      boldItalic: 'OpenSans-Bolditalic',
      ExtraBold: 'OpenSans-Extrabold',
      ExtraBoldItalic: 'OpenSans-Extrabolditalic',
      italic: 'OpenSans-Italic',
      light: 'OpenSans-Light',
      lightItalic: 'OpenSans-Lightitalic',
      regular: 'OpenSans',
      semiBold: 'OpenSans-Semibold',
      semiBoldItalic: 'OpenSans-Semibolditalic',
    },
    rounded: {
      black: 'VAGRoundedStd-Black',
      bold: 'VAGRoundedStd-Bold',
      light: 'VAGRoundedStd-Light',
      thin: 'VAGRoundedStd-Thin',
    }
  },
});
