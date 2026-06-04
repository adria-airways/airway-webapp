CREATE TABLE "locations" (
	"id" char(16) PRIMARY KEY NOT NULL,
	"title" varchar(64) NOT NULL,
	"country" char(2) NOT NULL,
	"latitude" real NOT NULL,
	"longitude" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "readings" (
	"id" serial PRIMARY KEY NOT NULL,
	"location_id" char(16) NOT NULL,
	"resolution" char(3) NOT NULL,
	"valid_at" timestamp with time zone NOT NULL,
	"temp_c" smallint,
	"temp_min_c" smallint,
	"temp_max_c" smallint,
	"rh_pct" smallint,
	"msl_hpa" smallint,
	"wind_kmh" smallint,
	"gust_kmh" smallint,
	"wind_dir" char(2),
	"precip_mm" real,
	"icon_code" varchar(32),
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "unique_readings" UNIQUE("location_id","resolution","valid_at")
);
--> statement-breakpoint
ALTER TABLE "readings" ADD CONSTRAINT "readings_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_fetch" ON "readings" USING btree ("fetched_at");