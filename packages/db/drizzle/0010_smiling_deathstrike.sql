CREATE TABLE "desktop_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code_hash" varchar(128) NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"org_id" varchar(128) NOT NULL,
	"state_hash" varchar(128) NOT NULL,
	"redirect_uri" varchar(512) NOT NULL,
	"code_challenge" varchar(128) NOT NULL,
	"code_method" varchar(16) DEFAULT 'S256' NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "desktop_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"org_id" varchar(128) NOT NULL,
	"token_hash" varchar(128) NOT NULL,
	"device_name" varchar(128),
	"app_version" varchar(64),
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"last_used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "desktop_code_hash" ON "desktop_codes" USING btree ("code_hash");--> statement-breakpoint
CREATE INDEX "desktop_user_org" ON "desktop_codes" USING btree ("user_id","org_id");--> statement-breakpoint
CREATE INDEX "desktop_code_expiry" ON "desktop_codes" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "desktop_sessions_token_hash" ON "desktop_sessions" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "desktop_sessions_user_org" ON "desktop_sessions" USING btree ("user_id","org_id");--> statement-breakpoint
CREATE INDEX "desktop_sessions_expires_at" ON "desktop_sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "desktop_sessions_revoked_at" ON "desktop_sessions" USING btree ("revoked_at");