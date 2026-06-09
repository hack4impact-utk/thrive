ALTER TABLE "recurring_events" ADD COLUMN "days_of_week" integer[];--> statement-breakpoint
ALTER TABLE "recurring_events" ADD COLUMN "weekdays_only" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "recurring_events" ADD COLUMN "monthly_type" varchar(32);--> statement-breakpoint
ALTER TABLE "recurring_events" ADD COLUMN "monthly_nth" integer;--> statement-breakpoint
ALTER TABLE "recurring_events" ADD COLUMN "monthly_weekday" integer;