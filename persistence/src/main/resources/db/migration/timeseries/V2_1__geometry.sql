ALTER TABLE "detection_count"
ADD COLUMN "location" GEOMETRY(Point, 4326);

UPDATE "detection_count"
SET "location" = ST_SetSRID(ST_MakePoint("longitude", "latitude"), 4326);