import { desc, eq } from "drizzle-orm";
import { getChatGPTUser } from "../../../chatgpt-auth";
import { getDb } from "../../../../db";
import { profileShares, profiles } from "../../../../db/schema";

const channels = ["whatsapp", "email", "manual"] as const;
const statuses = ["sent", "viewed", "interested", "declined", "follow_up"] as const;

export async function GET(request: Request) {
  if (!(await getChatGPTUser())) return Response.json({ error: "Sign in required." }, { status: 401 });
  const profileId = new URL(request.url).searchParams.get("profileId");
  if (!profileId) return Response.json({ error: "Profile id is required." }, { status: 400 });
  const rows = await getDb().select().from(profileShares).where(eq(profileShares.profileId, profileId)).orderBy(desc(profileShares.createdAt)).limit(100);
  return Response.json({ shares: rows });
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });
  const payload = await request.json() as { profileId?: string; recipientName?: string; recipientContact?: string; channel?: string; notes?: string; profileConsent?: boolean };
  if (!payload.profileId || !payload.recipientName?.trim() || !payload.channel || !channels.includes(payload.channel as typeof channels[number])) return Response.json({ error: "Recipient and sharing method are required." }, { status: 400 });
  if (!payload.profileConsent) return Response.json({ error: "Profile owner consent must be confirmed before sharing." }, { status: 400 });
  const [profile] = await getDb().select({ status: profiles.status }).from(profiles).where(eq(profiles.id, payload.profileId)).limit(1);
  if (!profile || profile.status !== "approved") return Response.json({ error: "Only approved profiles can be shared." }, { status: 400 });
  const share = { id: crypto.randomUUID(), profileId: payload.profileId, recipientName: payload.recipientName.trim(), recipientContact: payload.recipientContact?.trim() || "", channel: payload.channel as typeof channels[number], notes: payload.notes?.trim() || "", profileConsent: "confirmed", contactConsent: "not_granted", sharedBy: user.email };
  await getDb().insert(profileShares).values(share);
  return Response.json({ share }, { status: 201 });
}

export async function PATCH(request: Request) {
  if (!(await getChatGPTUser())) return Response.json({ error: "Sign in required." }, { status: 401 });
  const payload = await request.json() as { id?: string; status?: string; contactConsent?: string; notes?: string };
  if (!payload.id) return Response.json({ error: "Share id is required." }, { status: 400 });
  const updates: Partial<typeof profileShares.$inferInsert> = { updatedAt: new Date().toISOString() };
  if (payload.status && statuses.includes(payload.status as typeof statuses[number])) updates.status = payload.status as typeof statuses[number];
  if (payload.contactConsent && ["not_granted", "granted"].includes(payload.contactConsent)) updates.contactConsent = payload.contactConsent;
  if (typeof payload.notes === "string") updates.notes = payload.notes.trim();
  await getDb().update(profileShares).set(updates).where(eq(profileShares.id, payload.id));
  return Response.json({ ok: true });
}
