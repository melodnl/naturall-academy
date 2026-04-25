import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: {
    default: "Naturall Academy",
    template: "%s · Naturall Academy",
  },
  description:
    "600 natural cosmetic recipes — your professional library of artisan cosmetics.",
  manifest: "/manifest.webmanifest",
  applicationName: "Naturall Academy",
  appleWebApp: {
    capable: true,
    title: "Naturall",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.svg", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#1e3a2c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
