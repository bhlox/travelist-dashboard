ALTER TABLE "bookings" RENAME COLUMN "person_in_charge" TO "handler";--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "handler" SET DATA TYPE text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_handler_user_id_fk" FOREIGN KEY ("handler") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
