import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "World Timeline - Personal Travels",
    template: "%s | World Timeline",
  },
  description: "An interactive 3D globe and timeline visualization of travel experiences across the globe. Explore stories, photos, and milestones.",
  keywords: ["travel", "portfolio", "3d globe", "interactive timeline", "personal stories"],
  authors: [{ name: "Traveler" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-portfolio.com",
    siteName: "World Timeline",
    title: "World Timeline - Personal Travels",
    description: "An interactive 3D globe and timeline visualization of personal travel experiences.",
    images: [
      {
        url: "/og-image.jpg", // Placeholder - needs to be created or replaced
        width: 1200,
        height: 630,
        alt: "World Timeline Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "World Timeline - Personal Travels",
    description: "An interactive 3D globe and timeline visualization of personal travel experiences.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
