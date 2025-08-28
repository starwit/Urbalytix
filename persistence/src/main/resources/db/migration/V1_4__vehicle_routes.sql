CREATE SEQUENCE IF NOT EXISTS "vehicleroutes_id_seq";

CREATE TABLE "vehicleroutes"
(
    "id" BIGINT NOT NULL DEFAULT nextval('vehicleroutes_id_seq'),
    "vehicle_id" BIGINT NOT NULL,
    "latitude" DECIMAL(22,19),
    "longitude" DECIMAL(22,19),
    "update_ts" TIMESTAMP WITH TIME ZONE,
    CONSTRAINT "vehicleroutes_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "fk_vehicleroutes_vehicledata" FOREIGN KEY ("vehicle_id") REFERENCES "vehicledata"("id")
);