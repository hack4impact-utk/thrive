CREATE TABLE "locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"street_line" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"postal_code" text NOT NULL,
	"country" text NOT NULL,
	"latitude" numeric(9, 6),
	"longitude" numeric(9, 6),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "location_id" uuid;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "street_line";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "city";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "state";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "postal_code";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "country";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "latitude";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "longitude";