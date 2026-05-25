import { GoogleAnalytics } from "@next/third-parties/google"

import { gaMeasurementId } from "@/lib/config"

export function GoogleAnalyticsProvider() {
  if (!gaMeasurementId) return null

  return <GoogleAnalytics gaId={gaMeasurementId} />
}
