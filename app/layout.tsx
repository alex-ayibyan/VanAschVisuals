import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

// TODO: replace with the live domain before deploying so OG/Twitter image URLs resolve
const siteUrl = "https://ziggyvanasch.be";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ziggy Van Asch — Fotografie",
    template: "%s | Ziggy Van Asch",
  },
  description:
    "Fotografieportfolio van Ziggy Van Asch. Bekijk projecten, leer meer over mijn werk en neem contact op voor samenwerkingen.",
  keywords: ["fotografie", "fotograaf", "portfolio", "Ziggy Van Asch", "België"],
  openGraph: {
    title: "Ziggy Van Asch — Fotografie",
    description: "Fotografieportfolio van Ziggy Van Asch.",
    url: siteUrl,
    siteName: "Ziggy Van Asch",
    images: [{ url: "/zvaprofile.jpeg", width: 800, height: 1000 }],
    locale: "nl_BE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ziggy Van Asch — Fotografie",
    description: "Fotografieportfolio van Ziggy Van Asch.",
    images: ["/zvaprofile.jpeg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={archivo.variable}>
      <body>{children}</body>
    </html>
  );
}
