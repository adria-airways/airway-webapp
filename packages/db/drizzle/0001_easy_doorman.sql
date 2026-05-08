CREATE TABLE "snapshots" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "snapshots_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"snapshot_time" timestamp with time zone NOT NULL,
	"aircraft_count" integer NOT NULL,
	CONSTRAINT "snapshots_snapshot_time_unique" UNIQUE("snapshot_time")
);
--> statement-breakpoint
CREATE TABLE "plane_live" (
	"hex" text PRIMARY KEY NOT NULL,
	"snapshot_time" timestamp with time zone NOT NULL,
	"calsign" text,
	"origin_country" text,
	"latitude" double precision,
	"longitude" double precision,
	"baro_altitude" double precision,
	"on_ground" boolean,
	"ground_speed" double precision,
	"heading" double precision,
	"vertical_rate" double precision,
	"spi" boolean
);
--> statement-breakpoint
CREATE TABLE "plane_snapshots" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "plane_snapshots_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"snapshot_id" bigint NOT NULL,
	"snapshot_time" timestamp with time zone NOT NULL,
	"hex" text NOT NULL,
	"callsign" text,
	"origin_country" text,
	"latitude" double precision,
	"longitude" double precision,
	"baro_altitude" double precision,
	"on_ground" boolean,
	"ground_speed" double precision,
	"heading" double precision,
	"vertical_rate" double precision,
	"spi" boolean,
	CONSTRAINT "plane_snapshots_hex_time_unique" UNIQUE("hex","snapshot_time")
);
--> statement-breakpoint
ALTER TABLE "plane_snapshots" ADD CONSTRAINT "plane_snapshots_snapshot_id_snapshots_id_fk" FOREIGN KEY ("snapshot_id") REFERENCES "public"."snapshots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "snapshots_time_index" ON "snapshots" USING btree ("snapshot_time");--> statement-breakpoint
CREATE INDEX "plane_live_snapshot_time_index" ON "plane_live" USING btree ("snapshot_time");--> statement-breakpoint
CREATE INDEX "plane_snapshots_snapshot_id_index" ON "plane_snapshots" USING btree ("snapshot_id");--> statement-breakpoint
CREATE INDEX "plane_snapshots_snapshot_time_index" ON "plane_snapshots" USING btree ("snapshot_time");