CREATE TABLE `profile_shares` (
	`id` text PRIMARY KEY NOT NULL,
	`profile_id` text NOT NULL,
	`recipient_name` text NOT NULL,
	`recipient_contact` text DEFAULT '' NOT NULL,
	`channel` text NOT NULL,
	`status` text DEFAULT 'sent' NOT NULL,
	`profile_consent` text DEFAULT 'confirmed' NOT NULL,
	`contact_consent` text DEFAULT 'not_granted' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`shared_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_profile_shares_profile_created` ON `profile_shares` (`profile_id`,`created_at`);
--> statement-breakpoint
CREATE INDEX `idx_profile_shares_status` ON `profile_shares` (`status`);
--> statement-breakpoint
PRAGMA optimize;
