import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { GoogleGenAI } from "@google/genai";
import { supabase } from "../../lib/supabase";

export const prerender = false;

// Confirmed against the live models.list endpoint for this API key (Jul 2026).
// gemini-3.5-flash and the gemini-flash-latest alias (which currently points to
// it) were both returning 503 "high demand" from Google at build time, so this
// uses gemini-2.5-flash — the established, reliably-available free-tier Flash
// model — instead. Revisit once gemini-3.5-flash capacity settles.
const GEMINI_MODEL = "gemini-2.5-flash";

const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_LENGTH = 20;
const MAX_SESSION_ID_LENGTH = 100;

type ChatRole = "user" | "bot";

interface ChatMessage {
  role: ChatRole;
  text: string;
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    (v.role === "user" || v.role === "bot") &&
    typeof v.text === "string" &&
    v.text.trim().length > 0 &&
    v.text.length <= MAX_MESSAGE_LENGTH
  );
}

async function buildSystemInstruction(): Promise<string> {
  const destinations = await getCollection("destinations");
  const packages = await getCollection("packages");

  const destinationLines = destinations.map((d) => {
    const hasPackage = d.data.package ? "yes" : "no";
    const city = d.data.city ? `${d.data.city}, ` : "";
    const activities = d.data.activities.length > 0 ? `; activities: ${d.data.activities.join(", ")}` : "";
    return `- ${d.data.title} (${city}${d.data.country}) — vibes: ${d.data.vibes.join(", ")}; best season: ${d.data.bestSeason}${activities}; "${d.data.tagline}"; bookable package: ${hasPackage}`;
  });

  const packageLines = packages.map((p) => {
    const basedOn = p.data.destinations.map((ref) => ref.id).join(", ");
    const activities = p.data.activities.length > 0 ? `; activities: ${p.data.activities.join(", ")}` : "";
    return `- ${p.data.title} — based on: ${basedOn}; vibes: ${p.data.vibes.join(", ")}; ${p.data.durationDays} days; €${p.data.priceFrom}–€${p.data.priceTo} ${p.data.currency} (${p.data.priceBasis}, indicative placeholder — not a real quote); great for: ${p.data.greatFor.join(", ")}${activities}; highlights: ${p.data.highlights.slice(0, 3).join("; ")}`;
  });

  return `You are the Voia guide — a warm, well-travelled friend helping people find a trip, in Voia's brand voice.

VOICE
- Plain and human: short sentences, second person ("you"), no travel-agent jargon.
- Inclusive and budget-aware: a weekend in the Carpathians is celebrated as much as two weeks in Bali.
- Inspiring, not hype-y: paint the feeling, don't shout "once-in-a-lifetime."
- Helpful and honest: if something's seasonal, crowded, or pricey, say so.
- Keep replies short and friendly — a few sentences, not an essay.
- Reply in plain text only — no markdown (no asterisks, headers, or bullet lists), since replies render as plain chat bubbles.

CATALOG — the only destinations and packages you may discuss (do not invent others):

DESTINATIONS:
${destinationLines.join("\n")}

PACKAGES:
${packageLines.join("\n")}

ROUTING (send people to the right page)
- Booking a trip, sending an enquiry, or giving personal details → point them to /enquire.
- General questions, support, partnerships, or anything not about a specific trip → point them to /contact.

GUARDRAILS (follow strictly)
- Only discuss this catalog and closely related general travel help (packing, seasons, general trip advice). If asked about anything else, or a place not in this catalog, briefly say it's outside what you can help with and suggest /contact for anything specific.
- Never invent or state a firm price, hotel name, opening hour, or itinerary detail beyond what's given above. All prices here are indicative placeholders — always describe them that way, never as final.
- Never ask for or store personal details (name, email, phone, etc.). If someone wants to book or enquire, point them to the /enquire page — do not collect their information yourself.
- If you're unsure about something, say so briefly rather than guessing, and point to /contact.
- Do not roleplay as a human, do not claim to make bookings, and do not discuss anything unrelated to travel.`;
}

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function resolveSessionId(payload: Record<string, unknown>): string {
  const raw = payload.session_id;
  if (
    typeof raw === "string" &&
    raw.length >= 1 &&
    raw.length <= MAX_SESSION_ID_LENGTH
  ) {
    return raw;
  }
  return crypto.randomUUID();
}

async function saveTranscript(
  sessionId: string,
  transcript: ChatMessage[],
): Promise<void> {
  try {
    const { error } = await supabase.from("chat_transcripts").insert({
      session_id: sessionId,
      transcript,
      interest_tag: null,
    });
    if (error) {
      console.error("Failed to save chat transcript:", error);
    }
  } catch (err) {
    console.error("Failed to save chat transcript:", err);
  }
}

export const POST: APIRoute = async ({ request }) => {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid request." }, 400);
  }

  if (typeof payload !== "object" || payload === null || !("messages" in payload)) {
    return jsonResponse({ error: "Invalid request." }, 400);
  }

  const rawMessages = (payload as Record<string, unknown>).messages;
  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    return jsonResponse({ error: "Invalid request." }, 400);
  }
  if (rawMessages.length > MAX_HISTORY_LENGTH) {
    return jsonResponse({ error: "Too many messages." }, 400);
  }
  if (!rawMessages.every(isChatMessage)) {
    return jsonResponse({ error: "Invalid request." }, 400);
  }
  const messages = rawMessages as ChatMessage[];
  const sessionId = resolveSessionId(payload as Record<string, unknown>);

  const apiKey = import.meta.env.GEMINI_API_KEY ?? process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set on the server.");
    return jsonResponse({ error: "Something went wrong. Please try again later." }, 500);
  }

  try {
    const systemInstruction = await buildSystemInstruction();
    const contents = messages.map((m) => ({
      role: m.role === "bot" ? "model" : "user",
      parts: [{ text: m.text }],
    }));

    const ai = new GoogleGenAI({ apiKey });
    const res = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        systemInstruction,
        temperature: 0.6,
        maxOutputTokens: 700,
      },
    });

    const reply = res.text;
    if (!reply) {
      console.error("Gemini returned an empty response.");
      return jsonResponse({ error: "Something went wrong. Please try again later." }, 500);
    }

    await saveTranscript(sessionId, [...messages, { role: "bot", text: reply }]);

    return jsonResponse({ reply }, 200);
  } catch (err) {
    console.error("Gemini request failed:", err);
    return jsonResponse({ error: "Something went wrong. Please try again later." }, 500);
  }
};
