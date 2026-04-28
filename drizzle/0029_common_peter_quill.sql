CREATE TABLE "recurring_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(256) NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"capacity" integer,
	"location_id" uuid,
	"description" text NOT NULL,
	"frequency" varchar(32) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "recurring_event_id" uuid;--> statement-breakpoint
ALTER TABLE "recurring_events" ADD CONSTRAINT "recurring_events_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_recurring_event_id_recurring_events_id_fk" FOREIGN KEY ("recurring_event_id") REFERENCES "public"."recurring_events"("id") ON DELETE no action ON UPDATE no action;