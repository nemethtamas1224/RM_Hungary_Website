import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_manufacturers_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_categories_catalog_role" AS ENUM('catalog', 'legacy');
  CREATE TYPE "public"."enum_product_families_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_products_product_kind" AS ENUM('model', 'type', 'accessory', 'legacy');
  CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_products_review_state" AS ENUM('source-check', 'identified', 'specs-missing', 'ready');
  CREATE TYPE "public"."enum__products_v_version_product_kind" AS ENUM('model', 'type', 'accessory', 'legacy');
  CREATE TYPE "public"."enum__products_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_version_review_state" AS ENUM('source-check', 'identified', 'specs-missing', 'ready');
  CREATE TYPE "public"."enum_used_machines_condition" AS ENUM('unknown', 'used', 'refurbished');
  CREATE TYPE "public"."enum_used_machines_availability" AS ENUM('ask', 'available', 'sold');
  CREATE TYPE "public"."enum_used_machines_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_references_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pages_page_type" AS ENUM('page', 'category', 'source');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_page_type" AS ENUM('page', 'category', 'source');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TABLE "manufacturers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"logo_id" integer,
  	"featured_on_homepage" boolean DEFAULT false,
  	"homepage_sort_order" numeric DEFAULT 0,
  	"source_url" varchar,
  	"review_note" varchar,
  	"status" "enum_manufacturers_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"parent_id" integer,
  	"sort_order" numeric DEFAULT 0,
  	"image_id" integer,
  	"catalog_role" "enum_categories_catalog_role" DEFAULT 'catalog' NOT NULL,
  	"original_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "product_families_overview_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"secondary_image_id" integer,
  	"secondary_image_alt" varchar
  );
  
  CREATE TABLE "product_families_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "product_families" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"manufacturer_id" integer,
  	"category_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"sort_order" numeric DEFAULT 0,
  	"status" "enum_product_families_status" DEFAULT 'draft' NOT NULL,
  	"summary" varchar,
  	"image_id" integer,
  	"card_logo_id" integer,
  	"card_title" varchar,
  	"card_description" varchar,
  	"overview_title" varchar,
  	"overview_intro" varchar,
  	"source_details" varchar,
  	"source_url" varchar,
  	"review_note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_specifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "products_configurations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"value" varchar,
  	"source_url" varchar
  );
  
  CREATE TABLE "products_hose_sizes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"diameter_mm" numeric,
  	"length_m" numeric
  );
  
  CREATE TABLE "products_technical_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"image_id" integer,
  	"image_alt" varchar
  );
  
  CREATE TABLE "products_technical_tables_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cell1" varchar,
  	"cell2" varchar,
  	"cell3" varchar,
  	"cell4" varchar,
  	"cell5" varchar,
  	"cell6" varchar
  );
  
  CREATE TABLE "products_technical_tables" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"column1" varchar,
  	"column2" varchar,
  	"column3" varchar,
  	"column4" varchar,
  	"column5" varchar,
  	"column6" varchar
  );
  
  CREATE TABLE "products_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "products_card_hose_sizes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"diameter_mm" numeric,
  	"length_m" numeric
  );
  
  CREATE TABLE "products_source_evidence" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"note" varchar,
  	"media_id" integer
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"manufacturer_id" integer,
  	"brand" varchar,
  	"category_id" integer,
  	"family_id" integer,
  	"name" varchar,
  	"slug" varchar,
  	"model_code" varchar,
  	"product_kind" "enum_products_product_kind" DEFAULT 'model',
  	"sort_order" numeric DEFAULT 0,
  	"show_in_family" boolean DEFAULT true,
  	"status" "enum_products_status" DEFAULT 'draft',
  	"review_state" "enum_products_review_state" DEFAULT 'source-check',
  	"review_note" varchar,
  	"summary" varchar,
  	"card_description" varchar,
  	"description" jsonb,
  	"gx_technical" boolean,
  	"image_id" integer,
  	"card_image_id" integer,
  	"card_logo_id" integer,
  	"source_details" varchar,
  	"original_url" varchar,
  	"legacy_key" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_products_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"products_id" integer
  );
  
  CREATE TABLE "_products_v_version_specifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_configurations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"value" varchar,
  	"source_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_hose_sizes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"diameter_mm" numeric,
  	"length_m" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_technical_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_technical_tables_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"cell1" varchar,
  	"cell2" varchar,
  	"cell3" varchar,
  	"cell4" varchar,
  	"cell5" varchar,
  	"cell6" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_technical_tables" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"column1" varchar,
  	"column2" varchar,
  	"column3" varchar,
  	"column4" varchar,
  	"column5" varchar,
  	"column6" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_card_hose_sizes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"diameter_mm" numeric,
  	"length_m" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_source_evidence" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"note" varchar,
  	"media_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_manufacturer_id" integer,
  	"version_brand" varchar,
  	"version_category_id" integer,
  	"version_family_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_model_code" varchar,
  	"version_product_kind" "enum__products_v_version_product_kind" DEFAULT 'model',
  	"version_sort_order" numeric DEFAULT 0,
  	"version_show_in_family" boolean DEFAULT true,
  	"version_status" "enum__products_v_version_status" DEFAULT 'draft',
  	"version_review_state" "enum__products_v_version_review_state" DEFAULT 'source-check',
  	"version_review_note" varchar,
  	"version_summary" varchar,
  	"version_card_description" varchar,
  	"version_description" jsonb,
  	"version_gx_technical" boolean,
  	"version_image_id" integer,
  	"version_card_image_id" integer,
  	"version_card_logo_id" integer,
  	"version_source_details" varchar,
  	"version_original_url" varchar,
  	"version_legacy_key" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__products_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_products_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"products_id" integer
  );
  
  CREATE TABLE "used_machines" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"listing_code" varchar NOT NULL,
  	"manufacturer_id" integer,
  	"model" varchar,
  	"product_id" integer,
  	"year" numeric,
  	"condition" "enum_used_machines_condition" DEFAULT 'unknown',
  	"operating_hours" numeric,
  	"price_text" varchar,
  	"description" varchar,
  	"availability" "enum_used_machines_availability" DEFAULT 'ask',
  	"source_url" varchar,
  	"status" "enum_used_machines_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "used_machines_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"body" jsonb,
  	"cover_image_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"original_url" varchar,
  	"status" "enum_news_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_news_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_news_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_body" jsonb,
  	"version_cover_image_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_original_url" varchar,
  	"version_status" "enum__news_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "references" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"location" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"original_url" varchar,
  	"status" "enum_references_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "references_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"products_id" integer
  );
  
  CREATE TABLE "pages_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_media_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"page_type" "enum_pages_page_type" DEFAULT 'page',
  	"status" "enum_pages_status" DEFAULT 'published',
  	"content" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"source_text" varchar,
  	"source_headings" jsonb,
  	"source_links" jsonb,
  	"original_url" varchar,
  	"legacy_key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_page_type" "enum__pages_v_version_page_type" DEFAULT 'page',
  	"version_status" "enum__pages_v_version_status" DEFAULT 'published',
  	"version_content" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_source_text" varchar,
  	"version_source_headings" jsonb,
  	"version_source_links" jsonb,
  	"version_original_url" varchar,
  	"version_legacy_key" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"message" varchar NOT NULL,
  	"product_id" integer,
  	"used_machine_id" integer,
  	"privacy_consent" boolean DEFAULT false NOT NULL,
  	"handled" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"source_url" varchar,
  	"credit" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "legacy_mappings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"legacy_key" varchar NOT NULL,
  	"source_name" varchar NOT NULL,
  	"source_url" varchar NOT NULL,
  	"legacy_category_id" integer,
  	"target_category_id" integer,
  	"target_path" varchar NOT NULL,
  	"source_product_id" integer,
  	"review_note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "legacy_mappings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_users_role" DEFAULT 'admin' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"manufacturers_id" integer,
  	"categories_id" integer,
  	"product_families_id" integer,
  	"products_id" integer,
  	"used_machines_id" integer,
  	"news_id" integer,
  	"references_id" integer,
  	"pages_id" integer,
  	"inquiries_id" integer,
  	"media_id" integer,
  	"legacy_mappings_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_footer_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company_name" varchar DEFAULT 'RM Hajdú Hungary Kft.',
  	"address" varchar DEFAULT '4132 Tépe, Rákóczi u. 8.',
  	"mailing_address" varchar DEFAULT '4132 Tépe, Fő u. 8.',
  	"phone" varchar DEFAULT '+36 30/2780944',
  	"email" varchar,
  	"map_embed_url" varchar,
  	"hero_subhead" varchar,
  	"hero_image_id" integer,
  	"service_image_id" integer,
  	"logo_id" integer,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"email_source_url" varchar,
  	"hero_headline" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "manufacturers" ADD CONSTRAINT "manufacturers_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_families_overview_sections" ADD CONSTRAINT "product_families_overview_sections_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_families_overview_sections" ADD CONSTRAINT "product_families_overview_sections_secondary_image_id_media_id_fk" FOREIGN KEY ("secondary_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_families_overview_sections" ADD CONSTRAINT "product_families_overview_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_families"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_families_videos" ADD CONSTRAINT "product_families_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_families"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_families" ADD CONSTRAINT "product_families_manufacturer_id_manufacturers_id_fk" FOREIGN KEY ("manufacturer_id") REFERENCES "public"."manufacturers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_families" ADD CONSTRAINT "product_families_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_families" ADD CONSTRAINT "product_families_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_families" ADD CONSTRAINT "product_families_card_logo_id_media_id_fk" FOREIGN KEY ("card_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_specifications" ADD CONSTRAINT "products_specifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_configurations" ADD CONSTRAINT "products_configurations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_hose_sizes" ADD CONSTRAINT "products_hose_sizes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_technical_sections" ADD CONSTRAINT "products_technical_sections_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_technical_sections" ADD CONSTRAINT "products_technical_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_technical_tables_rows" ADD CONSTRAINT "products_technical_tables_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_technical_tables"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_technical_tables" ADD CONSTRAINT "products_technical_tables_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_videos" ADD CONSTRAINT "products_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_card_hose_sizes" ADD CONSTRAINT "products_card_hose_sizes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_source_evidence" ADD CONSTRAINT "products_source_evidence_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_source_evidence" ADD CONSTRAINT "products_source_evidence_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_manufacturer_id_manufacturers_id_fk" FOREIGN KEY ("manufacturer_id") REFERENCES "public"."manufacturers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_family_id_product_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."product_families"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_card_image_id_media_id_fk" FOREIGN KEY ("card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_card_logo_id_media_id_fk" FOREIGN KEY ("card_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_specifications" ADD CONSTRAINT "_products_v_version_specifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_configurations" ADD CONSTRAINT "_products_v_version_configurations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_hose_sizes" ADD CONSTRAINT "_products_v_version_hose_sizes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_technical_sections" ADD CONSTRAINT "_products_v_version_technical_sections_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_version_technical_sections" ADD CONSTRAINT "_products_v_version_technical_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_technical_tables_rows" ADD CONSTRAINT "_products_v_version_technical_tables_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_technical_tables"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_technical_tables" ADD CONSTRAINT "_products_v_version_technical_tables_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_videos" ADD CONSTRAINT "_products_v_version_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_card_hose_sizes" ADD CONSTRAINT "_products_v_version_card_hose_sizes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_source_evidence" ADD CONSTRAINT "_products_v_version_source_evidence_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_version_source_evidence" ADD CONSTRAINT "_products_v_version_source_evidence_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_parent_id_products_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_manufacturer_id_manufacturers_id_fk" FOREIGN KEY ("version_manufacturer_id") REFERENCES "public"."manufacturers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_family_id_product_families_id_fk" FOREIGN KEY ("version_family_id") REFERENCES "public"."product_families"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_card_image_id_media_id_fk" FOREIGN KEY ("version_card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_card_logo_id_media_id_fk" FOREIGN KEY ("version_card_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "used_machines" ADD CONSTRAINT "used_machines_manufacturer_id_manufacturers_id_fk" FOREIGN KEY ("manufacturer_id") REFERENCES "public"."manufacturers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "used_machines" ADD CONSTRAINT "used_machines_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "used_machines_rels" ADD CONSTRAINT "used_machines_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."used_machines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "used_machines_rels" ADD CONSTRAINT "used_machines_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "references_rels" ADD CONSTRAINT "references_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."references"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "references_rels" ADD CONSTRAINT "references_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "references_rels" ADD CONSTRAINT "references_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_text" ADD CONSTRAINT "pages_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_gallery" ADD CONSTRAINT "pages_blocks_media_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_text" ADD CONSTRAINT "_pages_v_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_gallery" ADD CONSTRAINT "_pages_v_blocks_media_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_used_machine_id_used_machines_id_fk" FOREIGN KEY ("used_machine_id") REFERENCES "public"."used_machines"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legacy_mappings" ADD CONSTRAINT "legacy_mappings_legacy_category_id_categories_id_fk" FOREIGN KEY ("legacy_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legacy_mappings" ADD CONSTRAINT "legacy_mappings_target_category_id_categories_id_fk" FOREIGN KEY ("target_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legacy_mappings" ADD CONSTRAINT "legacy_mappings_source_product_id_products_id_fk" FOREIGN KEY ("source_product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legacy_mappings_rels" ADD CONSTRAINT "legacy_mappings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."legacy_mappings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legacy_mappings_rels" ADD CONSTRAINT "legacy_mappings_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_manufacturers_fk" FOREIGN KEY ("manufacturers_id") REFERENCES "public"."manufacturers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_families_fk" FOREIGN KEY ("product_families_id") REFERENCES "public"."product_families"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_used_machines_fk" FOREIGN KEY ("used_machines_id") REFERENCES "public"."used_machines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_references_fk" FOREIGN KEY ("references_id") REFERENCES "public"."references"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_legacy_mappings_fk" FOREIGN KEY ("legacy_mappings_id") REFERENCES "public"."legacy_mappings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_navigation" ADD CONSTRAINT "site_settings_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_navigation" ADD CONSTRAINT "site_settings_footer_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_service_image_id_media_id_fk" FOREIGN KEY ("service_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "manufacturers_name_idx" ON "manufacturers" USING btree ("name");
  CREATE UNIQUE INDEX "manufacturers_slug_idx" ON "manufacturers" USING btree ("slug");
  CREATE INDEX "manufacturers_logo_idx" ON "manufacturers" USING btree ("logo_id");
  CREATE INDEX "manufacturers_updated_at_idx" ON "manufacturers" USING btree ("updated_at");
  CREATE INDEX "manufacturers_created_at_idx" ON "manufacturers" USING btree ("created_at");
  CREATE INDEX "categories_name_idx" ON "categories" USING btree ("name");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");
  CREATE INDEX "categories_image_idx" ON "categories" USING btree ("image_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "product_families_overview_sections_order_idx" ON "product_families_overview_sections" USING btree ("_order");
  CREATE INDEX "product_families_overview_sections_parent_id_idx" ON "product_families_overview_sections" USING btree ("_parent_id");
  CREATE INDEX "product_families_overview_sections_image_idx" ON "product_families_overview_sections" USING btree ("image_id");
  CREATE INDEX "product_families_overview_sections_secondary_image_idx" ON "product_families_overview_sections" USING btree ("secondary_image_id");
  CREATE INDEX "product_families_videos_order_idx" ON "product_families_videos" USING btree ("_order");
  CREATE INDEX "product_families_videos_parent_id_idx" ON "product_families_videos" USING btree ("_parent_id");
  CREATE INDEX "product_families_manufacturer_idx" ON "product_families" USING btree ("manufacturer_id");
  CREATE INDEX "product_families_category_idx" ON "product_families" USING btree ("category_id");
  CREATE UNIQUE INDEX "product_families_name_idx" ON "product_families" USING btree ("name");
  CREATE UNIQUE INDEX "product_families_slug_idx" ON "product_families" USING btree ("slug");
  CREATE INDEX "product_families_image_idx" ON "product_families" USING btree ("image_id");
  CREATE INDEX "product_families_card_logo_idx" ON "product_families" USING btree ("card_logo_id");
  CREATE INDEX "product_families_updated_at_idx" ON "product_families" USING btree ("updated_at");
  CREATE INDEX "product_families_created_at_idx" ON "product_families" USING btree ("created_at");
  CREATE INDEX "products_specifications_order_idx" ON "products_specifications" USING btree ("_order");
  CREATE INDEX "products_specifications_parent_id_idx" ON "products_specifications" USING btree ("_parent_id");
  CREATE INDEX "products_configurations_order_idx" ON "products_configurations" USING btree ("_order");
  CREATE INDEX "products_configurations_parent_id_idx" ON "products_configurations" USING btree ("_parent_id");
  CREATE INDEX "products_hose_sizes_order_idx" ON "products_hose_sizes" USING btree ("_order");
  CREATE INDEX "products_hose_sizes_parent_id_idx" ON "products_hose_sizes" USING btree ("_parent_id");
  CREATE INDEX "products_technical_sections_order_idx" ON "products_technical_sections" USING btree ("_order");
  CREATE INDEX "products_technical_sections_parent_id_idx" ON "products_technical_sections" USING btree ("_parent_id");
  CREATE INDEX "products_technical_sections_image_idx" ON "products_technical_sections" USING btree ("image_id");
  CREATE INDEX "products_technical_tables_rows_order_idx" ON "products_technical_tables_rows" USING btree ("_order");
  CREATE INDEX "products_technical_tables_rows_parent_id_idx" ON "products_technical_tables_rows" USING btree ("_parent_id");
  CREATE INDEX "products_technical_tables_order_idx" ON "products_technical_tables" USING btree ("_order");
  CREATE INDEX "products_technical_tables_parent_id_idx" ON "products_technical_tables" USING btree ("_parent_id");
  CREATE INDEX "products_videos_order_idx" ON "products_videos" USING btree ("_order");
  CREATE INDEX "products_videos_parent_id_idx" ON "products_videos" USING btree ("_parent_id");
  CREATE INDEX "products_card_hose_sizes_order_idx" ON "products_card_hose_sizes" USING btree ("_order");
  CREATE INDEX "products_card_hose_sizes_parent_id_idx" ON "products_card_hose_sizes" USING btree ("_parent_id");
  CREATE INDEX "products_source_evidence_order_idx" ON "products_source_evidence" USING btree ("_order");
  CREATE INDEX "products_source_evidence_parent_id_idx" ON "products_source_evidence" USING btree ("_parent_id");
  CREATE INDEX "products_source_evidence_media_idx" ON "products_source_evidence" USING btree ("media_id");
  CREATE INDEX "products_manufacturer_idx" ON "products" USING btree ("manufacturer_id");
  CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");
  CREATE INDEX "products_family_idx" ON "products" USING btree ("family_id");
  CREATE INDEX "products_name_idx" ON "products" USING btree ("name");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_image_idx" ON "products" USING btree ("image_id");
  CREATE INDEX "products_card_image_idx" ON "products" USING btree ("card_image_id");
  CREATE INDEX "products_card_logo_idx" ON "products" USING btree ("card_logo_id");
  CREATE INDEX "products_legacy_key_idx" ON "products" USING btree ("legacy_key");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products__status_idx" ON "products" USING btree ("_status");
  CREATE INDEX "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX "products_rels_media_id_idx" ON "products_rels" USING btree ("media_id");
  CREATE INDEX "products_rels_products_id_idx" ON "products_rels" USING btree ("products_id");
  CREATE INDEX "_products_v_version_specifications_order_idx" ON "_products_v_version_specifications" USING btree ("_order");
  CREATE INDEX "_products_v_version_specifications_parent_id_idx" ON "_products_v_version_specifications" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_configurations_order_idx" ON "_products_v_version_configurations" USING btree ("_order");
  CREATE INDEX "_products_v_version_configurations_parent_id_idx" ON "_products_v_version_configurations" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_hose_sizes_order_idx" ON "_products_v_version_hose_sizes" USING btree ("_order");
  CREATE INDEX "_products_v_version_hose_sizes_parent_id_idx" ON "_products_v_version_hose_sizes" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_technical_sections_order_idx" ON "_products_v_version_technical_sections" USING btree ("_order");
  CREATE INDEX "_products_v_version_technical_sections_parent_id_idx" ON "_products_v_version_technical_sections" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_technical_sections_image_idx" ON "_products_v_version_technical_sections" USING btree ("image_id");
  CREATE INDEX "_products_v_version_technical_tables_rows_order_idx" ON "_products_v_version_technical_tables_rows" USING btree ("_order");
  CREATE INDEX "_products_v_version_technical_tables_rows_parent_id_idx" ON "_products_v_version_technical_tables_rows" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_technical_tables_order_idx" ON "_products_v_version_technical_tables" USING btree ("_order");
  CREATE INDEX "_products_v_version_technical_tables_parent_id_idx" ON "_products_v_version_technical_tables" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_videos_order_idx" ON "_products_v_version_videos" USING btree ("_order");
  CREATE INDEX "_products_v_version_videos_parent_id_idx" ON "_products_v_version_videos" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_card_hose_sizes_order_idx" ON "_products_v_version_card_hose_sizes" USING btree ("_order");
  CREATE INDEX "_products_v_version_card_hose_sizes_parent_id_idx" ON "_products_v_version_card_hose_sizes" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_source_evidence_order_idx" ON "_products_v_version_source_evidence" USING btree ("_order");
  CREATE INDEX "_products_v_version_source_evidence_parent_id_idx" ON "_products_v_version_source_evidence" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_source_evidence_media_idx" ON "_products_v_version_source_evidence" USING btree ("media_id");
  CREATE INDEX "_products_v_parent_idx" ON "_products_v" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_version_manufacturer_idx" ON "_products_v" USING btree ("version_manufacturer_id");
  CREATE INDEX "_products_v_version_version_category_idx" ON "_products_v" USING btree ("version_category_id");
  CREATE INDEX "_products_v_version_version_family_idx" ON "_products_v" USING btree ("version_family_id");
  CREATE INDEX "_products_v_version_version_name_idx" ON "_products_v" USING btree ("version_name");
  CREATE INDEX "_products_v_version_version_slug_idx" ON "_products_v" USING btree ("version_slug");
  CREATE INDEX "_products_v_version_version_image_idx" ON "_products_v" USING btree ("version_image_id");
  CREATE INDEX "_products_v_version_version_card_image_idx" ON "_products_v" USING btree ("version_card_image_id");
  CREATE INDEX "_products_v_version_version_card_logo_idx" ON "_products_v" USING btree ("version_card_logo_id");
  CREATE INDEX "_products_v_version_version_legacy_key_idx" ON "_products_v" USING btree ("version_legacy_key");
  CREATE INDEX "_products_v_version_version_updated_at_idx" ON "_products_v" USING btree ("version_updated_at");
  CREATE INDEX "_products_v_version_version_created_at_idx" ON "_products_v" USING btree ("version_created_at");
  CREATE INDEX "_products_v_version_version__status_idx" ON "_products_v" USING btree ("version__status");
  CREATE INDEX "_products_v_created_at_idx" ON "_products_v" USING btree ("created_at");
  CREATE INDEX "_products_v_updated_at_idx" ON "_products_v" USING btree ("updated_at");
  CREATE INDEX "_products_v_latest_idx" ON "_products_v" USING btree ("latest");
  CREATE INDEX "_products_v_autosave_idx" ON "_products_v" USING btree ("autosave");
  CREATE INDEX "_products_v_rels_order_idx" ON "_products_v_rels" USING btree ("order");
  CREATE INDEX "_products_v_rels_parent_idx" ON "_products_v_rels" USING btree ("parent_id");
  CREATE INDEX "_products_v_rels_path_idx" ON "_products_v_rels" USING btree ("path");
  CREATE INDEX "_products_v_rels_media_id_idx" ON "_products_v_rels" USING btree ("media_id");
  CREATE INDEX "_products_v_rels_products_id_idx" ON "_products_v_rels" USING btree ("products_id");
  CREATE UNIQUE INDEX "used_machines_slug_idx" ON "used_machines" USING btree ("slug");
  CREATE UNIQUE INDEX "used_machines_listing_code_idx" ON "used_machines" USING btree ("listing_code");
  CREATE INDEX "used_machines_manufacturer_idx" ON "used_machines" USING btree ("manufacturer_id");
  CREATE INDEX "used_machines_product_idx" ON "used_machines" USING btree ("product_id");
  CREATE INDEX "used_machines_updated_at_idx" ON "used_machines" USING btree ("updated_at");
  CREATE INDEX "used_machines_created_at_idx" ON "used_machines" USING btree ("created_at");
  CREATE INDEX "used_machines_rels_order_idx" ON "used_machines_rels" USING btree ("order");
  CREATE INDEX "used_machines_rels_parent_idx" ON "used_machines_rels" USING btree ("parent_id");
  CREATE INDEX "used_machines_rels_path_idx" ON "used_machines_rels" USING btree ("path");
  CREATE INDEX "used_machines_rels_media_id_idx" ON "used_machines_rels" USING btree ("media_id");
  CREATE INDEX "news_title_idx" ON "news" USING btree ("title");
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_cover_image_idx" ON "news" USING btree ("cover_image_id");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "news__status_idx" ON "news" USING btree ("_status");
  CREATE INDEX "_news_v_parent_idx" ON "_news_v" USING btree ("parent_id");
  CREATE INDEX "_news_v_version_version_title_idx" ON "_news_v" USING btree ("version_title");
  CREATE INDEX "_news_v_version_version_slug_idx" ON "_news_v" USING btree ("version_slug");
  CREATE INDEX "_news_v_version_version_cover_image_idx" ON "_news_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_news_v_version_version_updated_at_idx" ON "_news_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_v_version_version_created_at_idx" ON "_news_v" USING btree ("version_created_at");
  CREATE INDEX "_news_v_version_version__status_idx" ON "_news_v" USING btree ("version__status");
  CREATE INDEX "_news_v_created_at_idx" ON "_news_v" USING btree ("created_at");
  CREATE INDEX "_news_v_updated_at_idx" ON "_news_v" USING btree ("updated_at");
  CREATE INDEX "_news_v_latest_idx" ON "_news_v" USING btree ("latest");
  CREATE INDEX "_news_v_autosave_idx" ON "_news_v" USING btree ("autosave");
  CREATE INDEX "references_title_idx" ON "references" USING btree ("title");
  CREATE UNIQUE INDEX "references_slug_idx" ON "references" USING btree ("slug");
  CREATE INDEX "references_updated_at_idx" ON "references" USING btree ("updated_at");
  CREATE INDEX "references_created_at_idx" ON "references" USING btree ("created_at");
  CREATE INDEX "references_rels_order_idx" ON "references_rels" USING btree ("order");
  CREATE INDEX "references_rels_parent_idx" ON "references_rels" USING btree ("parent_id");
  CREATE INDEX "references_rels_path_idx" ON "references_rels" USING btree ("path");
  CREATE INDEX "references_rels_media_id_idx" ON "references_rels" USING btree ("media_id");
  CREATE INDEX "references_rels_products_id_idx" ON "references_rels" USING btree ("products_id");
  CREATE INDEX "pages_blocks_text_order_idx" ON "pages_blocks_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_text_parent_id_idx" ON "pages_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_text_path_idx" ON "pages_blocks_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_gallery_order_idx" ON "pages_blocks_media_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_gallery_parent_id_idx" ON "pages_blocks_media_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_gallery_path_idx" ON "pages_blocks_media_gallery" USING btree ("_path");
  CREATE INDEX "pages_title_idx" ON "pages" USING btree ("title");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_legacy_key_idx" ON "pages" USING btree ("legacy_key");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_media_id_idx" ON "pages_rels" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_text_order_idx" ON "_pages_v_blocks_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_text_parent_id_idx" ON "_pages_v_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_text_path_idx" ON "_pages_v_blocks_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_gallery_order_idx" ON "_pages_v_blocks_media_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_gallery_parent_id_idx" ON "_pages_v_blocks_media_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_gallery_path_idx" ON "_pages_v_blocks_media_gallery" USING btree ("_path");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_title_idx" ON "_pages_v" USING btree ("version_title");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_legacy_key_idx" ON "_pages_v" USING btree ("version_legacy_key");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_media_id_idx" ON "_pages_v_rels" USING btree ("media_id");
  CREATE INDEX "inquiries_product_idx" ON "inquiries" USING btree ("product_id");
  CREATE INDEX "inquiries_used_machine_idx" ON "inquiries" USING btree ("used_machine_id");
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "legacy_mappings_legacy_key_idx" ON "legacy_mappings" USING btree ("legacy_key");
  CREATE INDEX "legacy_mappings_legacy_category_idx" ON "legacy_mappings" USING btree ("legacy_category_id");
  CREATE INDEX "legacy_mappings_target_category_idx" ON "legacy_mappings" USING btree ("target_category_id");
  CREATE INDEX "legacy_mappings_source_product_idx" ON "legacy_mappings" USING btree ("source_product_id");
  CREATE INDEX "legacy_mappings_updated_at_idx" ON "legacy_mappings" USING btree ("updated_at");
  CREATE INDEX "legacy_mappings_created_at_idx" ON "legacy_mappings" USING btree ("created_at");
  CREATE INDEX "legacy_mappings_rels_order_idx" ON "legacy_mappings_rels" USING btree ("order");
  CREATE INDEX "legacy_mappings_rels_parent_idx" ON "legacy_mappings_rels" USING btree ("parent_id");
  CREATE INDEX "legacy_mappings_rels_path_idx" ON "legacy_mappings_rels" USING btree ("path");
  CREATE INDEX "legacy_mappings_rels_categories_id_idx" ON "legacy_mappings_rels" USING btree ("categories_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_manufacturers_id_idx" ON "payload_locked_documents_rels" USING btree ("manufacturers_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_product_families_id_idx" ON "payload_locked_documents_rels" USING btree ("product_families_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_used_machines_id_idx" ON "payload_locked_documents_rels" USING btree ("used_machines_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_references_id_idx" ON "payload_locked_documents_rels" USING btree ("references_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_legacy_mappings_id_idx" ON "payload_locked_documents_rels" USING btree ("legacy_mappings_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_navigation_order_idx" ON "site_settings_navigation" USING btree ("_order");
  CREATE INDEX "site_settings_navigation_parent_id_idx" ON "site_settings_navigation" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_navigation_order_idx" ON "site_settings_footer_navigation" USING btree ("_order");
  CREATE INDEX "site_settings_footer_navigation_parent_id_idx" ON "site_settings_footer_navigation" USING btree ("_parent_id");
  CREATE INDEX "site_settings_hero_image_idx" ON "site_settings" USING btree ("hero_image_id");
  CREATE INDEX "site_settings_service_image_idx" ON "site_settings" USING btree ("service_image_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "manufacturers" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "product_families_overview_sections" CASCADE;
  DROP TABLE "product_families_videos" CASCADE;
  DROP TABLE "product_families" CASCADE;
  DROP TABLE "products_specifications" CASCADE;
  DROP TABLE "products_configurations" CASCADE;
  DROP TABLE "products_hose_sizes" CASCADE;
  DROP TABLE "products_technical_sections" CASCADE;
  DROP TABLE "products_technical_tables_rows" CASCADE;
  DROP TABLE "products_technical_tables" CASCADE;
  DROP TABLE "products_videos" CASCADE;
  DROP TABLE "products_card_hose_sizes" CASCADE;
  DROP TABLE "products_source_evidence" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "_products_v_version_specifications" CASCADE;
  DROP TABLE "_products_v_version_configurations" CASCADE;
  DROP TABLE "_products_v_version_hose_sizes" CASCADE;
  DROP TABLE "_products_v_version_technical_sections" CASCADE;
  DROP TABLE "_products_v_version_technical_tables_rows" CASCADE;
  DROP TABLE "_products_v_version_technical_tables" CASCADE;
  DROP TABLE "_products_v_version_videos" CASCADE;
  DROP TABLE "_products_v_version_card_hose_sizes" CASCADE;
  DROP TABLE "_products_v_version_source_evidence" CASCADE;
  DROP TABLE "_products_v" CASCADE;
  DROP TABLE "_products_v_rels" CASCADE;
  DROP TABLE "used_machines" CASCADE;
  DROP TABLE "used_machines_rels" CASCADE;
  DROP TABLE "news" CASCADE;
  DROP TABLE "_news_v" CASCADE;
  DROP TABLE "references" CASCADE;
  DROP TABLE "references_rels" CASCADE;
  DROP TABLE "pages_blocks_text" CASCADE;
  DROP TABLE "pages_blocks_media_gallery" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_text" CASCADE;
  DROP TABLE "_pages_v_blocks_media_gallery" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "inquiries" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "legacy_mappings" CASCADE;
  DROP TABLE "legacy_mappings_rels" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_navigation" CASCADE;
  DROP TABLE "site_settings_footer_navigation" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_manufacturers_status";
  DROP TYPE "public"."enum_categories_catalog_role";
  DROP TYPE "public"."enum_product_families_status";
  DROP TYPE "public"."enum_products_product_kind";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum_products_review_state";
  DROP TYPE "public"."enum__products_v_version_product_kind";
  DROP TYPE "public"."enum__products_v_version_status";
  DROP TYPE "public"."enum__products_v_version_review_state";
  DROP TYPE "public"."enum_used_machines_condition";
  DROP TYPE "public"."enum_used_machines_availability";
  DROP TYPE "public"."enum_used_machines_status";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum__news_v_version_status";
  DROP TYPE "public"."enum_references_status";
  DROP TYPE "public"."enum_pages_page_type";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_page_type";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
