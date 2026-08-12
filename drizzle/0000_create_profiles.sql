CREATE TABLE `profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`registration_id` text NOT NULL,
	`full_name` text NOT NULL,
	`gender` text NOT NULL,
	`date_of_birth` text NOT NULL,
	`caste` text DEFAULT '' NOT NULL,
	`city` text DEFAULT '' NOT NULL,
	`district` text DEFAULT '' NOT NULL,
	`mobile` text NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`photo_key` text,
	`details` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `profiles_registration_id_unique` ON `profiles` (`registration_id`);
--> statement-breakpoint
CREATE INDEX `idx_profiles_status_created` ON `profiles` (`status`,`created_at`);
--> statement-breakpoint
CREATE INDEX `idx_profiles_gender_caste` ON `profiles` (`gender`,`caste`);
--> statement-breakpoint
CREATE INDEX `idx_profiles_city` ON `profiles` (`city`);
--> statement-breakpoint
PRAGMA optimize;
