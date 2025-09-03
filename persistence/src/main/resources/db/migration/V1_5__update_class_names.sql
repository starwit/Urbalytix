DROP TABLE "objectclass" CASCADE;

ALTER TABLE "detection_count" ADD COLUMN "class_name" VARCHAR(255) DEFAULT 'waste';

CREATE INDEX IF NOT EXISTS "detection_count_class_name_idx" ON "detection_count" ("class_name");

ALTER TABLE "detection_count" DROP COLUMN "class_id";