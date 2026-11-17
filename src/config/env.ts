/**
 * Application Environment Configuration
 * Centralized, validated environment variables with resilient fallbacks.
 */

function getEnvVar(key: string, fallback: string): string {
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return fallback;
}

export const ENV = {
  NODE_ENV: getEnvVar("NODE_ENV", "production"),
  IS_PRODUCTION: getEnvVar("NODE_ENV", "production") === "production",
  IS_DEVELOPMENT: getEnvVar("NODE_ENV", "production") === "development",

  // Supabase Credentials (Database & Storage)
  SUPABASE_URL: getEnvVar("NEXT_PUBLIC_SUPABASE_URL", ""),
  SUPABASE_ANON_KEY: getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY", ""),
  SUPABASE_SERVICE_KEY: getEnvVar("SUPABASE_SERVICE_KEY", ""),
  SUPABASE_STORAGE_BUCKET: getEnvVar("SUPABASE_STORAGE_BUCKET", "candela-media"),

  // Public Domain & Concierge
  SITE_URL: getEnvVar("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  WHATSAPP_NUMBER: getEnvVar("NEXT_PUBLIC_WHATSAPP_NUMBER", "917063099602"),
  CONCIERGE_PHONE: getEnvVar("NEXT_PUBLIC_CONCIERGE_PHONE", "+91 70630 99602"),
  CONCIERGE_EMAIL: getEnvVar("NEXT_PUBLIC_CONCIERGE_EMAIL", "candelafuture10@gmail.com"),
} as const;
