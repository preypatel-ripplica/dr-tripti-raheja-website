import { Suspense } from "react";
import Script from "next/script";
import RouteAnalytics from "./RouteAnalytics";

const GA_MEASUREMENT_ID = "G-D4ZTT97LW2";

export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname + window.location.search
          });
        `}
      </Script>
      <Suspense fallback={null}>
        <RouteAnalytics measurementId={GA_MEASUREMENT_ID} />
      </Suspense>
    </>
  );
}
