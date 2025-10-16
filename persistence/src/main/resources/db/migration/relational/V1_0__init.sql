CREATE SEQUENCE IF NOT EXISTS "detection_count_id_seq";

CREATE TABLE "detection_count"
(
    "detection_time" TIMESTAMP WITH TIME ZONE,
    "latitude" DECIMAL(22,19),
    "longitude" DECIMAL(22,19),
    "count" SMALLINT NOT NULL,
    "class_name" VARCHAR(255) DEFAULT 'waste',
    "id" BIGINT NOT NULL DEFAULT nextval('detection_count_id_seq'),
    CONSTRAINT "detection_pkey" PRIMARY KEY ("id", "detection_time", "class_name")
);

CREATE SEQUENCE IF NOT EXISTS "action_id_seq";

CREATE SEQUENCE IF NOT EXISTS "vehicle_id_seq";

CREATE TABLE "vehicledata"
(
    "id" BIGINT NOT NULL DEFAULT nextval('vehicle_id_seq'),
    "name" VARCHAR(255) NOT NULL,
    "streamkey" VARCHAR(255) UNIQUE NOT NULL,
    "description" Text,
    "latitude" DECIMAL(22,19),
    "longitude" DECIMAL(22,19),
    "last_update" TIMESTAMP WITH TIME ZONE,
    CONSTRAINT "vehicledata_pkey" PRIMARY KEY ("id")
);

CREATE SEQUENCE IF NOT EXISTS "vehicleroutes_id_seq";

CREATE TABLE "vehicleroutes"
(
    "id" BIGINT NOT NULL DEFAULT nextval('vehicleroutes_id_seq'),
    "vehicle_id" BIGINT NOT NULL,
    "latitude" DECIMAL(22,19),
    "longitude" DECIMAL(22,19),
    "update_ts" TIMESTAMP WITH TIME ZONE,
    CONSTRAINT "vehicleroutes_pkey" PRIMARY KEY ("vehicle_id", "update_ts", "id"),
    CONSTRAINT "fk_vehicleroutes_vehicledata" FOREIGN KEY ("vehicle_id") REFERENCES "vehicledata"("id")
);

