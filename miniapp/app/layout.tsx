import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";

const siteUrl = process.env.NEXT_PUBLIC_URL || "https://millionaire-arena.example.com";

const ogTitle = "Millionaire Arena";
const ogDescription = "Skill-based trivia battle royale on Base. Join the pot, climb the ladder—gasless. No purchase necessary.";

export const metadata: Metadata = {
  title: ogTitle,
  description: ogDescription,
  openGraph: {
    title: ogTitle,
    description: ogDescription,
    url: siteUrl,
    siteName: "Millionaire Arena",
    images: [{ url: `${siteUrl}/og.png`, width: 1200, height: 630, alt: "Millionaire Arena – Trivia battle royale" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: ogTitle,
    description: ogDescription,
    images: [`${siteUrl}/og.png`],
  },
  other: {
    "fc:miniapp": JSON.stringify({
      version: "next",
      imageUrl: `${siteUrl}/og.png`,
      button: {
        title: "Join arena",
        action: {
          type: "launch_miniapp",
          name: "Millionaire Arena",
          url: siteUrl,
          splashImageUrl: `${siteUrl}/splash.png`,
          splashBackgroundColor: "#0a0a0a",
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
