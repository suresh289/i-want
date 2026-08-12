import { sql } from "drizzle-orm";
import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const profiles = sqliteTable("profiles", {
  id: text("id").primaryKey(),
  registrationId: text("registration_id").notNull().unique(),
  fullName: text("full_name").notNull(),
  gender: text("gender").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  caste: text("caste").notNull().default(""),
  city: text("city").notNull().default(""),
  district: text("district").notNull().default(""),
  mobile: text("mobile").notNull(),
  email: text("email").notNull().default(""),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).notNull().default("pending"),
  photoKey: text("photo_key"),
  details: text("details", { mode: "json" }).$type<Record<string, string>>().notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_profiles_status_created").on(table.status, table.createdAt),
  index("idx_profiles_gender_caste").on(table.gender, table.caste),
  index("idx_profiles_city").on(table.city),
]);

export const profileShares = sqliteTable("profile_shares", {
  id: text("id").primaryKey(),
  profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  recipientName: text("recipient_name").notNull(),
  recipientContact: text("recipient_contact").notNull().default(""),
  channel: text("channel", { enum: ["whatsapp", "email", "manual"] }).notNull(),
  status: text("status", { enum: ["sent", "viewed", "interested", "declined", "follow_up"] }).notNull().default("sent"),
  profileConsent: text("profile_consent").notNull().default("confirmed"),
  contactConsent: text("contact_consent").notNull().default("not_granted"),
  notes: text("notes").notNull().default(""),
  sharedBy: text("shared_by").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_profile_shares_profile_created").on(table.profileId, table.createdAt),
  index("idx_profile_shares_status").on(table.status),
]);
