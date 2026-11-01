import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { BorrowedItemsProvider } from '@/contexts/borrowed-items-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <BorrowedItemsProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="id_data" />
          <Stack.Screen name="id_data_warn" />
          <Stack.Screen name="id_page" />
          <Stack.Screen name="return_id" />
        </Stack>
      </ThemeProvider>
    </BorrowedItemsProvider>
  );
}
