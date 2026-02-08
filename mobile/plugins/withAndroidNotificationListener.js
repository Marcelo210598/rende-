const { withAndroidManifest } = require("@expo/config-plugins");

const withAndroidNotificationListener = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const mainApplication = androidManifest.manifest.application[0];

    // Add xmlns:tools to manifest
    if (!androidManifest.manifest.$["xmlns:tools"]) {
      androidManifest.manifest.$["xmlns:tools"] =
        "http://schemas.android.com/tools";
    }

    // Add tools:replace="android:allowBackup" to application
    if (!mainApplication.$["tools:replace"]) {
      mainApplication.$["tools:replace"] = "android:allowBackup";
    } else if (
      !mainApplication.$["tools:replace"].includes("android:allowBackup")
    ) {
      mainApplication.$["tools:replace"] += ",android:allowBackup";
    }

    const serviceName =
      "com.lesimoes.androidnotificationlistener.RNAndroidNotificationListener";
    const existingService = mainApplication.service?.find(
      (s) => s["$"]["android:name"] === serviceName,
    );

    if (!existingService) {
      // Ensure service array exists
      if (!mainApplication.service) {
        mainApplication.service = [];
      }

      mainApplication.service.push({
        $: {
          "android:name": serviceName,
          "android:label": "@string/app_name",
          "android:permission":
            "android.permission.BIND_NOTIFICATION_LISTENER_SERVICE",
          "android:exported": "true",
        },
        "intent-filter": [
          {
            action: [
              {
                $: {
                  "android:name":
                    "android.service.notification.NotificationListenerService",
                },
              },
            ],
          },
        ],
      });
    }

    return config;
  });
};

module.exports = withAndroidNotificationListener;
