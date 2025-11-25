UPDATE "vehicleroutes"
SET "location" = ST_SetSRID(ST_MakePoint("longitude", "latitude"), 4326);

UPDATE "vehicledata"
SET "location" = ST_SetSRID(ST_MakePoint("longitude", "latitude"), 4326);