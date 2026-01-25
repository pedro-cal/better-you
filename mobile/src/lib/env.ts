import Constants from "expo-constants";
import { z } from "zod";

const schema = z.object({
  API_BASE_URL: z.string().url(),
  ENV: z.enum(["dev", "preview", "prod"]),
});

const extras = (Constants.expoConfig?.extra ?? {}) as Record<string, unknown>;
export const env = schema.parse(extras);
