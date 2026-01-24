CREATE TABLE "user_info" (
	"user_id" text PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"middle_name" varchar(50),
	"last_name" varchar(50) NOT NULL,
	"email" text NOT NULL,
	"gender" varchar(20),
	"birth_month" integer NOT NULL,
	"birth_day" integer NOT NULL,
	"birth_year" integer NOT NULL,
	"phone_number" varchar(20),
	"is_text_opted_in" boolean DEFAULT false NOT NULL,
	"address_line_1" text NOT NULL,
	"address_line_2" varchar(50),
	"city" varchar(100) NOT NULL,
	"state" varchar(50) NOT NULL,
	"postal_code" varchar(20) NOT NULL,
	"country" varchar(50) NOT NULL,
	"is_student" boolean NOT NULL,
	"preferred_neighborhood" text,
	"shirt_size" varchar(10),
	"medical_notes" text
);
--> statement-breakpoint
ALTER TABLE "user_info" ADD CONSTRAINT "user_info_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;