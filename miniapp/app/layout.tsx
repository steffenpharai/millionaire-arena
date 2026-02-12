import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_URL || "https://millionaire-arena.example.com";

export const metadata: Metadata = {
  title: "Millionaire Arena",
  description: "Skill-based trivia battle royale on Base. No purchase necessary.",
  other: {
    "fc:miniapp": JSON.stringify({
      version: "next",
      imageUrl: `${siteUrl}/embed.png`,
      button: {
        title: "Play Now",
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
