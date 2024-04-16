ALTER TABLE "blocked_schedules" RENAME COLUMN "personnel" TO "handlerID";--> statement-breakpoint
ALTER TABLE "blocked_schedules" DROP CONSTRAINT "blocked_schedules_personnel_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blocked_schedules" ADD CONSTRAINT "blocked_schedules_handlerID_user_id_fk" FOREIGN KEY ("handlerID") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
