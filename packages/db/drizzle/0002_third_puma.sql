ALTER TABLE "plane_live" ADD COLUMN "airline" text;--> statement-breakpoint
ALTER TABLE "plane_live" ADD COLUMN "flying_from_country" text;--> statement-breakpoint
ALTER TABLE "plane_live" ADD COLUMN "flying_from_latitude" double precision;--> statement-breakpoint
ALTER TABLE "plane_live" ADD COLUMN "flying_from_longitude" double precision;--> statement-breakpoint
ALTER TABLE "plane_live" ADD COLUMN "flying_from_city" text;--> statement-breakpoint
ALTER TABLE "plane_live" ADD COLUMN "flying_from_airport" text;--> statement-breakpoint
ALTER TABLE "plane_live" ADD COLUMN "flying_to_country" text;--> statement-breakpoint
ALTER TABLE "plane_live" ADD COLUMN "flying_to_latitude" double precision;--> statement-breakpoint
ALTER TABLE "plane_live" ADD COLUMN "flying_to_longitude" double precision;--> statement-breakpoint
ALTER TABLE "plane_live" ADD COLUMN "flying_to_city" text;--> statement-breakpoint
ALTER TABLE "plane_live" ADD COLUMN "flying_to_airport" text;--> statement-breakpoint
ALTER TABLE "plane_snapshots" ADD COLUMN "airline" text;--> statement-breakpoint
ALTER TABLE "plane_snapshots" ADD COLUMN "flying_from_country" text;--> statement-breakpoint
ALTER TABLE "plane_snapshots" ADD COLUMN "flying_from_latitude" double precision;--> statement-breakpoint
ALTER TABLE "plane_snapshots" ADD COLUMN "flying_from_longitude" double precision;--> statement-breakpoint
ALTER TABLE "plane_snapshots" ADD COLUMN "flying_from_city" text;--> statement-breakpoint
ALTER TABLE "plane_snapshots" ADD COLUMN "flying_from_airport" text;--> statement-breakpoint
ALTER TABLE "plane_snapshots" ADD COLUMN "flying_to_country" text;--> statement-breakpoint
ALTER TABLE "plane_snapshots" ADD COLUMN "flying_to_latitude" double precision;--> statement-breakpoint
ALTER TABLE "plane_snapshots" ADD COLUMN "flying_to_longitude" double precision;--> statement-breakpoint
ALTER TABLE "plane_snapshots" ADD COLUMN "flying_to_city" text;--> statement-breakpoint
ALTER TABLE "plane_snapshots" ADD COLUMN "flying_to_airport" text;