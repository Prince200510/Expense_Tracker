import { useEffect } from 'react';
import { View, Text } from 'react-native';
import DashboardScreen from './src/screens/DashboardScreen';
import { registerForPushNotificationsAsync, scheduleDailyReminder } from './src/services/NotificationService';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "./global.css";

export default function App() {
  useEffect(() => {
    async function setupNotifications() {
      await registerForPushNotificationsAsync();
      await scheduleDailyReminder();
    }
    setupNotifications();
  }, []);

  return (
    <SafeAreaProvider>
      <DashboardScreen />
    </SafeAreaProvider>
  );
}
