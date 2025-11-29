import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { StatusBar } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();



  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar
        hidden={true}
      />
      <Stack screenOptions={{ headerShown: false }}>
      </Stack>
    </ThemeProvider>
  );
}
