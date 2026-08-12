import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { profiles } from "../../../../db/schema";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const [profile] = await getDb().select({ photoKey: profiles.photoKey, status: profiles.status }).from(profiles).where(eq(profiles.id, id)).limit(1);
  if (!profile?.photoKey || profile.status !== "approved") return new Response("Not found", { status: 404 });
  const object = await env.PROFILE_PHOTOS.get(profile.photoKey);
  if (!object) return new Response("Not found", { status: 404 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Cache-Control", "private, max-age=300");
  return new Response(object.body, { headers });
}
