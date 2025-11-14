UPDATE "detection_count"
SET "location" = ST_SetSRID(ST_MakePoint("longitude", "latitude"), 4326);