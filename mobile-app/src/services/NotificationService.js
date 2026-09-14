import notifee, { TriggerType, RepeatFrequency, AndroidImportance } from '@notifee/react-native';

export async function registerForPushNotificationsAsync() {
  try {
    await notifee.requestPermission();
  } catch (error) {
    console.warn("Failed to request Notifee permissions: ", error);
  }
}

export async function scheduleDailyReminder() {
  try {
    const channelId = await notifee.createChannel({
      id: 'reminders',
      name: 'Daily Reminders',
      importance: AndroidImportance.HIGH,
    });

    const date = new Date(Date.now());
    date.setHours(21);
    date.setMinutes(0);
    date.setSeconds(0);
    
    // If it's already past 9 PM, schedule for tomorrow
    if (date.getTime() < Date.now()) {
      date.setDate(date.getDate() + 1);
    }

    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
      repeatFrequency: RepeatFrequency.DAILY,
    };

    await notifee.createTriggerNotification(
      {
        title: 'Expense Reminder 🔔',
        body: 'Don\'t forget to add today\'s expenses!',
        android: {
          channelId,
          smallIcon: 'ic_launcher',
          pressAction: {
            id: 'default',
          },
        },
      },
      trigger,
    );
  } catch (error) {
    console.warn("Failed to schedule daily reminder with Notifee: ", error);
  }
}

export async function sendLocalNotification(title, body) {
  try {
    const channelId = await notifee.createChannel({
      id: 'instant',
      name: 'Instant Notifications',
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId,
        smallIcon: 'ic_launcher',
        pressAction: {
          id: 'default',
        },
      },
    });
  } catch (error) {
    console.warn("Failed to send local notification with Notifee: ", error);
  }
}
