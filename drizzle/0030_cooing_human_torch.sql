ALTER TABLE "user_info" ADD COLUMN "email_registration_reminder" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "user_info" ADD COLUMN "email_unregistration_reminder" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "user_info" ADD COLUMN "email_day_of_reminder" boolean DEFAULT true NOT NULL;