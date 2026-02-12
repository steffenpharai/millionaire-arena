/**
 * decodeArenaQuestion: Agent tool to decode obfuscated arena questions.
 * Obfuscation: ROT13 + Base64 + short riddle. LLM multi-step reasoning to decode.
 */

export function rot13(s: string): string {
  return s.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });
}

export function obfuscateForAgent(question: string, answers: string[]): string {
  const payload = JSON.stringify({ question, answers });
  const b64 = Buffer.from(payload, "utf-8").toString("base64");
  const encoded = rot13(b64);
  return `Arena riddle (decode ROT13 then Base64): ${encoded}`;
}

export function decodeArenaQuestion(obfuscatedPayload: string): { question: string; answers: string[] } | null {
  try {
    const match = /(?:ROT13 then Base64:?|:)\s*([A-Za-z0-9+/=]+)/.exec(obfuscatedPayload);
    const encoded = match ? match[1].trim() : obfuscatedPayload.trim();
    const b64 = rot13(encoded);
    const json = Buffer.from(b64, "base64").toString("utf-8");
    const parsed = JSON.parse(json) as { question?: string; answers?: string[] };
    if (typeof parsed.question === "string" && Array.isArray(parsed.answers))
      return { question: parsed.question, answers: parsed.answers };
    return null;
  } catch {
    return null;
  }
}
