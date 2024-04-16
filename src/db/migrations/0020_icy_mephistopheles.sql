ALTER TABLE "blocked_schedules" ADD COLUMN "approved" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "blocked_schedules" ADD COLUMN "status_updated_by" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blocked_schedules" ADD CONSTRAINT "blocked_schedules_status_updated_by_user_id_fk" FOREIGN KEY ("status_updated_by") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
