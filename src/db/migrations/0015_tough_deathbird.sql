DO $$ BEGIN
 ALTER TABLE "blocked_schedules" ADD CONSTRAINT "blocked_schedules_personnel_user_id_fk" FOREIGN KEY ("personnel") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
