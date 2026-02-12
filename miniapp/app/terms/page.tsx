"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-arena-bg text-arena-fg p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Terms &amp; disclaimer</h1>
      <div className="text-arena-muted text-sm space-y-4">
        <p>
          <strong className="text-arena-fg">No purchase necessary.</strong> You may participate in Millionaire Arena without paying. Entry paths that do not require purchase are available.
        </p>
        <p>
          Millionaire Arena is a <strong className="text-arena-fg">skill-based knowledge contest</strong>. Outcomes depend on your knowledge and skill, not chance. This is not gambling.
        </p>
        <p>
          By participating you agree to these terms. The game runs on Base L2. Token and pot mechanics are described in the project documentation. NY and other jurisdictions: this contest is structured as skill-based where applicable.
        </p>
      </div>
      <Link href="/" className="inline-block mt-6 py-2 px-4 rounded bg-arena-accent text-white">
        Back
      </Link>
    </main>
  );
}
