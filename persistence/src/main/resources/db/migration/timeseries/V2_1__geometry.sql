-- ALTER TABLE "detection_count"
-- (
--     "location" GEOMETRY, --> copy long, lat into geometry POINT(0 0)
-- );

ALTER TABLE "detection_count"
ADD COLUMN "location" GEOMETRY(Point, 4326);

UPDATE "detection_count"
SET "location" = ST_SetSRID(ST_MakePoint("longitude", "latitude"), 4326);

ALTER TABLE "detection_count"
DROP COLUMN "longitude",
DROP COLUMN "latitude";