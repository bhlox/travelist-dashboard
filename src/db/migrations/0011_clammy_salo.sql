ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'staff';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "test_role" text;