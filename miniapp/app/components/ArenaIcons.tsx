"use client";

const iconClass = "w-6 h-6 flex-shrink-0";

export function IconTrophy({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2a2 2 0 0 1 2 2v1h2a2 2 0 0 1 2 2v1a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V7a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2h4zm-2 6v2h4V8h-4zm-4 4h12v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-2zm2 4h8v2h-8v-2zm4-14h-2v2h2V2z" />
      <path d="M6 14h2v2H6v-2zm10 0h2v2h-2v-2zM4 18h2v2H4v-2zm12 0h2v2h-2v-2z" opacity="0.7" />
    </svg>
  );
}

export function IconLadder({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16M8 6v12M16 6v12" />
    </svg>
  );
}

export function IconUsers({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

export function IconFlame({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 23c4.97 0 9-3.134 9-7 0-2.5-1.5-4.5-3-6l-1.5 2c1.2 1.1 2 2.5 2 4 0 2.761-3.134 5-7 5s-7-2.239-7-5c0-1.5.8-2.9 2-4L6 10c-1.5 1.5-3 3.5-3 6 0 3.866 4.03 7 9 7z" />
      <path d="M12 14c-2.21 0-4-1.79-4-4 0-1.2.5-2.3 1.4-3.1C10.2 5.2 11 3.7 11 2c0 0 3 2 3 5 0 2.21-1.79 4-4 4z" opacity="0.9" />
    </svg>
  );
}

export function IconPlay({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

export function IconGift({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 116 0v5m-6 0a2 2 0 104 0m-4 0a2 2 0 114 0m-5 4v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2m0 4h10" />
    </svg>
  );
}

export function IconShield({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
    </svg>
  );
}
