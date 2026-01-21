ALTER TABLE "events" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "start_time" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "end_time" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "capacity" integer;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "street_line" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "state" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "postal_code" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "country" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "latitude" numeric(9, 6);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "longitude" numeric(9, 6);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "description" text;