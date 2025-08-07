import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Preload componentes críticos após o layout estar pronto
  useEffect(() => {
    if (loaded) {
      // Preload componentes essenciais de forma assíncrona
      setTimeout(() => {
        import('@/components/ThemedText');
        import('@/components/ThemedView');
        import('@/utils/performance');
      }, 100);
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack 
        screenOptions={{ 
          headerShown: false,
          // Otimizações de performance para navegação
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="cartao" />
        <Stack.Screen name="investir" />
        <Stack.Screen name="recarga" />
        <Stack.Screen name="mostrar-mais" />
        <Stack.Screen name="faturas" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}