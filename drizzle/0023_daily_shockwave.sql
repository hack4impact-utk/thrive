ALTER TABLE "user_info" ALTER COLUMN "preferred_neighborhood" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_info" ALTER COLUMN "gender" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_info" ALTER COLUMN "shirt_size" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_info" DROP COLUMN "is_text_opted_in";