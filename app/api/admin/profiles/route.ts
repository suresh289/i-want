import { and, desc, eq, like, or } from "drizzle-orm";
import { getChatGPTUser } from "../../../chatgpt-auth";
import { getDb } from "../../../../db";
import { profiles } from "../../../../db/schema";

async function authorized() { return Boolean(await getChatGPTUser()); }

export async function GET(request: Request) {
  if (!(await authorized())) return Response.json({ error: "Sign in required." }, { status: 401 });
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() || "";
  const status = url.searchParams.get("status") || "all";
  const filters = [];
  if (status !== "all") filters.push(eq(profiles.status, status as "pending" | "approved" | "rejected"));
  if (q) filters.push(or(like(profiles.fullName, `%${q}%`), like(profiles.registrationId, `%${q}%`), like(profiles.mobile, `%${q}%`), like(profiles.city, `%${q}%`))!);
  const rows = await getDb().select().from(profiles).where(filters.length ? and(...filters) : undefined).orderBy(desc(profiles.createdAt)).limit(200);
  return Response.json({ profiles: rows });
}

export async function PATCH(request: Request) {
  if (!(await authorized())) return Response.json({ error: "Sign in required." }, { status: 401 });
  const payload = await request.json() as { id?: string; status?: string; details?: Record<string, string> };
  if (!payload.id) return Response.json({ error: "Profile id is required." }, { status: 400 });
  if (payload.status && !["pending", "approved", "rejected"].includes(payload.status)) return Response.json({ error: "Invalid status." }, { status: 400 });
  const updates: Partial<typeof profiles.$inferInsert> = { updatedAt: new Date().toISOString() };
  if (payload.status) updates.status = payload.status as "pending" | "approved" | "rejected";
  if (payload.details) {
    updates.details = payload.details;
    updates.fullName = payload.details.fullName;
    updates.gender = payload.details.gender;
    updates.dateOfBirth = payload.details.dateOfBirth;
    updates.caste = payload.details.caste || "";
    updates.city = payload.details.city || "";
    updates.district = payload.details.district || "";
    updates.mobile = payload.details.mobile;
    updates.email = payload.details.email || "";
  }
  await getDb().update(profiles).set(updates).where(eq(profiles.id, payload.id));
  return Response.json({ ok: true });
}
