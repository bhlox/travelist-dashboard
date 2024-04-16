ALTER TABLE "user" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "profile_picture" text DEFAULT '/avatar_default.jpg';