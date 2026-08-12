import { env } from "cloudflare:workers";
import { profiles } from "../../../db/schema";
import { getDb } from "../../../db";

const required = ["fullName", "gender", "dateOfBirth", "mobile"] as const;

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const raw = form.get("profile");
    if (typeof raw !== "string") return Response.json({ error: "Profile details are required." }, { status: 400 });
    const details = JSON.parse(raw) as Record<string, string>;
    for (const field of required) {
      if (!details[field]?.trim()) return Response.json({ error: `${field} is required.` }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const registrationId = `MM-${new Date().getUTCFullYear()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
    const photo = form.get("photo");
    let photoKey: string | null = null;
    if (photo instanceof File && photo.size > 0) {
      if (!photo.type.startsWith("image/") || photo.size > 5_000_000) {
        return Response.json({ error: "Photo must be an image smaller than 5 MB." }, { status: 400 });
      }
      photoKey = `profiles/${id}/${photo.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
      await env.PROFILE_PHOTOS.put(photoKey, photo.stream(), { httpMetadata: { contentType: photo.type } });
    }

    await getDb().insert(profiles).values({
      id, registrationId, fullName: details.fullName.trim(), gender: details.gender,
      dateOfBirth: details.dateOfBirth, caste: details.caste || "", city: details.city || "",
      district: details.district || "", mobile: details.mobile.trim(), email: details.email || "",
      photoKey, details,
    });
    return Response.json({ id, registrationId, status: "pending" }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save profile.";
    return Response.json({ error: message }, { status: 500 });
  }
}
