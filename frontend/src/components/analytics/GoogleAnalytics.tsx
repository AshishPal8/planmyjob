import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";
import { envConfig } from "@/config/env.config";

export default function GoogleAnalytics() {
  if (!envConfig.gaMeasurementId) return null;
  return <NextGoogleAnalytics gaId={envConfig.gaMeasurementId} />;
}
