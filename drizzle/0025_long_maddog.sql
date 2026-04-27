ALTER TABLE "events" ADD COLUMN "deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "deleted" boolean DEFAULT false NOT NULL;