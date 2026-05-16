CREATE TABLE "plane_routes" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "plane_routes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"hex" text NOT NULL,
	"callsign" text NOT NULL,
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
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "plane_routes_hex_callsign_unique" UNIQUE("hex","callsign")
);
--> statement-breakpoint
CREATE INDEX "plane_routes_hex_index" ON "plane_routes" USING btree ("hex");--> statement-breakpoint
CREATE INDEX "plane_routes_callsign_index" ON "plane_routes" USING btree ("callsign");