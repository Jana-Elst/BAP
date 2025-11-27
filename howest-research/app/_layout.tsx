import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { View } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();



  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* <SafeAreaView style={{ flex: 1 }}> */}
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
        </Stack>
      </View>
      {/* </SafeAreaView> */}
    </ThemeProvider>
  );
}
