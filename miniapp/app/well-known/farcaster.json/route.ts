/**
 * Base App mini-app manifest. Add accountAssociation (header, payload, signature) via Base Build.
 * https://docs.base.org/mini-apps/quickstart/migrate-existing-apps
 */

const siteUrl = process.env.NEXT_PUBLIC_URL || "https://millionaire-arena.example.com";

function withValidProperties<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => (Array.isArray(v) ? v.length > 0 : v != null && v !== ""))
  ) as T;
}

export async function GET() {
  const manifest = withValidProperties({
    accountAssociation: {
      header: process.env.ACCOUNT_ASSOCIATION_HEADER || "",
      payload: process.env.ACCOUNT_ASSOCIATION_PAYLOAD || "",
      signature: process.env.ACCOUNT_ASSOCIATION_SIGNATURE || "",
    },
    miniapp: withValidProperties({
      version: "1",
      name: "Millionaire Arena",
      homeUrl: siteUrl,
      iconUrl: `${siteUrl}/icon.png`,
      splashImageUrl: `${siteUrl}/splash.png`,
      splashBackgroundColor: "#0a0a0a",
      webhookUrl: `${siteUrl}/api/webhook`,
      subtitle: "Trivia battle royale on Base",
      description: "Skill-based 15-question ladder. No purchase necessary.",
      screenshotUrls: [`${siteUrl}/screenshot.png`],
      primaryCategory: "social",
      tags: ["trivia", "base", "arena", "skill"],
      heroImageUrl: `${siteUrl}/og.png`,
      tagline: "Play instantly",
      ogTitle: "Millionaire Arena",
      ogDescription: "Skill-based trivia battle royale on Base.",
      ogImageUrl: `${siteUrl}/og.png`,
      noindex: true,
    }),
  });
  return Response.json(manifest);
}
