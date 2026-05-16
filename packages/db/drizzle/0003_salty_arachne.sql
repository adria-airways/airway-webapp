CREATE TABLE "plane_routes" (
	"callsign" text PRIMARY KEY NOT NULL,
	"airline" text,
	"flying_from_country" text,
	"flying_from_latitude" double precision,
	"flying_from_longitude" double precision,
	"flying_from_city" text,
	"flying_from_airport" text,
	"flying_to_country" text,
	"flying_to_latitude" double precision,
	"flying_to_longitude" double precision,
	"flying_to_city" text,
	"flying_to_airport" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "plane_live" DROP COLUMN "airline";--> statement-breakpoint
ALTER TABLE "plane_live" DROP COLUMN "flying_from_country";--> statement-breakpoint
ALTER TABLE "plane_live" DROP COLUMN "flying_from_latitude";--> statement-breakpoint
ALTER TABLE "plane_live" DROP COLUMN "flying_from_longitude";--> statement-breakpoint
ALTER TABLE "plane_live" DROP COLUMN "flying_from_city";--> statement-breakpoint
ALTER TABLE "plane_live" DROP COLUMN "flying_from_airport";--> statement-breakpoint
ALTER TABLE "plane_live" DROP COLUMN "flying_to_country";--> statement-breakpoint
ALTER TABLE "plane_live" DROP COLUMN "flying_to_latitude";--> statement-breakpoint
ALTER TABLE "plane_live" DROP COLUMN "flying_to_longitude";--> statement-breakpoint
ALTER TABLE "plane_live" DROP COLUMN "flying_to_city";--> statement-breakpoint
ALTER TABLE "plane_live" DROP COLUMN "flying_to_airport";--> statement-breakpoint
ALTER TABLE "plane_snapshots" DROP COLUMN "airline";--> statement-breakpoint
ALTER TABLE "plane_snapshots" DROP COLUMN "flying_from_country";--> statement-breakpoint
ALTER TABLE "plane_snapshots" DROP COLUMN "flying_from_latitude";--> statement-breakpoint
ALTER TABLE "plane_snapshots" DROP COLUMN "flying_from_longitude";--> statement-breakpoint
ALTER TABLE "plane_snapshots" DROP COLUMN "flying_from_city";--> statement-breakpoint
ALTER TABLE "plane_snapshots" DROP COLUMN "flying_from_airport";--> statement-breakpoint
ALTER TABLE "plane_snapshots" DROP COLUMN "flying_to_country";--> statement-breakpoint
ALTER TABLE "plane_snapshots" DROP COLUMN "flying_to_latitude";--> statement-breakpoint
ALTER TABLE "plane_snapshots" DROP COLUMN "flying_to_longitude";--> statement-breakpoint
ALTER TABLE "plane_snapshots" DROP COLUMN "flying_to_city";--> statement-breakpoint
ALTER TABLE "plane_snapshots" DROP COLUMN "flying_to_airport";