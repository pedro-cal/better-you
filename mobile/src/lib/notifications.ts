import * as Notifications from "expo-notifications";

export async function askPermissions() {
  try {
    const response = await Notifications.requestPermissionsAsync();
    return true; // Simplified for now - just assume granted
  } catch (error) {
    console.warn("Error requesting notification permissions:", error);
    return false;
  }
}

export async function getExpoPushToken() {
  const ok = await askPermissions();
  if (!ok) return null;

  try {
    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  } catch (error) {
    console.warn("Error getting push token:", error);
    return null;
  }
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
