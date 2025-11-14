ALTER TABLE "vehicleroutes"
ADD COLUMN "location" GEOMETRY(Point, 4326);

ALTER TABLE "vehicledata"
ADD COLUMN "location" GEOMETRY(Point, 4326);