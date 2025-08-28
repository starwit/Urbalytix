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

insert into "vehicledata" ("name", "streamkey", "description", "latitude", "longitude", "last_update") 
    VALUES
        ('test01', 'was-pod01', 'First test vehicle', 52.42335996525549, 10.868755139850846, '2025-08-25T15:36:16Z'),
        ('test02', 'was-pod02', 'Vehicle Simulation', 52.41988394071837, 10.71701465645312, '2025-08-25T15:36:16Z');