"use client";

import Link from "next/link";

export default function ResultsPage() {
  return (
    <main className="min-h-screen bg-arena-bg text-arena-fg p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Post-win distribution</h1>
      <p className="text-arena-muted text-sm mb-4">
        20% of the pot goes to the winner. Rest per ecosystem rules.
      </p>
      <p className="text-arena-muted text-sm mb-6">
        After a round is settled, the Game Master triggers payout. Winners claim via the pot contract.
      </p>
      <Link href="/" className="inline-block py-2 px-4 rounded bg-arena-accent text-white">
        Back home
      </Link>
      <footer className="mt-8 pt-4 border-t border-arena-muted text-sm text-arena-muted">
        No purchase necessary. Skill-based contest. <Link href="/terms" className="underline">Terms</Link>
      </footer>
    </main>
  );
}
