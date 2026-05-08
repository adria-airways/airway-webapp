ALTER TABLE "plane_live" RENAME COLUMN "calsign" TO "callsign";--> statement-breakpoint
ALTER TABLE "plane_live" ALTER COLUMN "on_ground" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "plane_live" ALTER COLUMN "spi" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "plane_snapshots" ALTER COLUMN "on_ground" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "plane_snapshots" ALTER COLUMN "spi" SET NOT NULL;