"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArenaFooter } from "./components/ArenaFooter";
import { DiscoveryCard } from "./components/figma/DiscoveryCard";
import { IconTrophy, IconLadder, IconUsers, IconFlame, IconPlay, IconGift } from "./components/ArenaIcons";

const BANNER_DISMISS_KEY = "arena-pot-banner-dismissed";
const DEFAULT_POT = 2500;

const navItems: {
  href: string;
  label: string;
  ariaLabel?: string;
  icon: React.ReactNode;
  primary?: boolean;
  borderClass: string;
  iconClass: string;
}[] = [
  { href: "/lobby", label: "Join arena (0 gas—sponsored!)", ariaLabel: "Join arena (gasless, sponsored)", icon: <IconTrophy />, primary: true, borderClass: "border-l-[#FFD700]", iconClass: "text-[#FFD700]" },
  { href: "/ladder", label: "View ladder", icon: <IconLadder />, borderClass: "border-l-[#0066FF]", iconClass: "text-[#0066FF]" },
  { href: "/leaderboard", label: "Leaderboard", icon: <IconUsers />, borderClass: "border-l-[#00D084]", iconClass: "text-[#00D084]" },
  { href: "/feed-pot", label: "Feed pot (0 gas—sponsored!)", ariaLabel: "Feed the pot (gasless, sponsored)", icon: <IconFlame />, borderClass: "border-l-[#FFA500]", iconClass: "text-[#FFA500]" },
  { href: "/game", label: "Play round (sample)", icon: <IconPlay />, borderClass: "border-l-[#7C3AED]", iconClass: "text-[#7C3AED]" },
  { href: "/results", label: "Post-win distribution", icon: <IconGift />, borderClass: "border-l-[#FFD700]", iconClass: "text-[#FFD700]" },
];

export default function Home() {
  const [bannerDismissed, setBannerDismissed] = useState(true);
  const [potAmount, setPotAmount] = useState(DEFAULT_POT);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setBannerDismissed(localStorage.getItem(BANNER_DISMISS_KEY) === "1");
    import("@farcaster/miniapp-sdk").then(({ sdk }) => {
      try {
        sdk.actions.ready();
      } catch {
        // not in Base App embed
      }
    }).catch(() => {});
  }, []);

  const showBanner = !bannerDismissed;
  const dismissBanner = () => {
    setBannerDismissed(true);
    if (typeof window !== "undefined") localStorage.setItem(BANNER_DISMISS_KEY, "1");
  };

  return (
    <main className="min-h-screen">
      {showBanner && (
        <div
          className="mb-4 mx-4 mt-4 rounded-xl bg-[#1A1A2E] px-4 py-3 flex items-center justify-between gap-2 border border-[#ffffff15] border-l-4 border-l-[#FFA500]"
          role="region"
          aria-label="Pot feed promo"
        >
          <Link href="/feed-pot" className="text-[#FFA500] font-medium hover:underline flex-1">
            Feed now—gasless stake! 0 gas—sponsored!
          </Link>
          <button
            type="button"
            onClick={dismissBanner}
            className="p-2 text-gray-400 hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            aria-label="Dismiss banner"
          >
            ×
          </button>
        </div>
      )}

      <DiscoveryCard potAmount={potAmount} joinHref="/lobby" />

      <nav className="px-4 pb-6 flex flex-col gap-3" aria-label="Main navigation">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-4 py-3 px-4 min-h-[52px] rounded-xl border-l-4 transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#0066FF] ${item.borderClass} ${
              item.primary
                ? "bg-gradient-to-r from-[#0066FF] to-[#7C3AED] text-white shadow-lg shadow-[#0066FF40]"
                : "bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1A] text-white border-[#ffffff15]"
            }`}
            aria-label={item.ariaLabel}
          >
            <span className={item.primary ? "text-[#FFD700]" : item.iconClass}>{item.icon}</span>
            <span className="font-medium flex-1 text-left">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="px-4 pb-8">
        <ArenaFooter />
      </div>
    </main>
  );
}
