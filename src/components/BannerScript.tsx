// components/BannerScript.tsx
"use client";

import Script from "next/script";

export default function BannerScript() {
  return (
    <Script
      src="http://localhost:3000/api/products/b5fd285f-08d8-47d6-b5fb-9b8d432662cc/banner"
      strategy="afterInteractive"
      onReady={() => console.log("Banner script loaded")}
      onError={(e) => console.error("Banner script failed", e)}
    />
  );
}
