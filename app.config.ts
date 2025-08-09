import "dotenv/config";
import type { ExpoConfig } from "expo/config";

export default (): ExpoConfig => ({
  name: "BetterYou",
  slug: "betteryou",
  scheme: "betteryou",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./assets/images/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: { supportsTablet: true },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  extra: {
    API_BASE_URL: process.env.API_BASE_URL ?? "http://10.0.2.2:3000",
    ENV: process.env.APP_ENV ?? "dev",
  },
  plugins: ["expo-router", "expo-notifications"],
  experiments: {
    typedRoutes: true,
  },
});
