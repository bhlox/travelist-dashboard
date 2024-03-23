CREATE TABLE IF NOT EXISTS "blocked_schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"time_ranges" json
);
