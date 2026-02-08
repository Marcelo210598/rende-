import { registerRootComponent } from "expo";
import App from "./App";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppRegistry } from "react-native";
import { RNAndroidNotificationListenerHeadlessJsName } from "react-native-android-notification-listener";

// --- BACKGROUND SERVICE ---
const headlessNotificationListener = async ({ notification }) => {
  if (!notification) return;

  const {
    title,
    text: message,
    packageName,
    time,
    id,
  } = JSON.parse(notification);

  // Filter relevant packages (Optional, to save battery/data)
  // const allowedPackages = ['com.nu.production', 'br.com.intermedium', 'com.itau.personal'];
  // if (!allowedPackages.includes(packageName)) return;

  try {
    const token = await AsyncStorage.getItem("sync_token");
    const apiUrl =
      (await AsyncStorage.getItem("api_url")) ||
      "https://rendeplus.vercel.app/api/sync/notification";

    if (!token) {
      console.log("[Sync] No token found");
      return;
    }

    // Send to Backend
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        message,
        packageName,
        timestamp: time,
        notificationId: id,
      }),
    });

    const result = await response.json();
    console.log("[Sync] Result:", result);
  } catch (error) {
    console.error("[Sync] Error:", error);
  }
};

// Register Background Task
AppRegistry.registerHeadlessTask(
  RNAndroidNotificationListenerHeadlessJsName,
  () => headlessNotificationListener,
);

registerRootComponent(App);
