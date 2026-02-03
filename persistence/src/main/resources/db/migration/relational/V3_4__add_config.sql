CREATE SEQUENCE IF NOT EXISTS "configuration_id_seq";

CREATE TABLE "configuration"
(
    "keyname" VARCHAR(255) NOT NULL,
	"valuefield" VARCHAR(1024) NOT NULL,
	"category" VARCHAR(255) NOT NULL,
    "datatype" VARCHAR(50) NOT NULL,
    "id" BIGINT NOT NULL DEFAULT nextval('configuration_id_seq'),
    CONSTRAINT "configuration_unique_key" UNIQUE("keyname"),
    CONSTRAINT "configuration_pkey" PRIMARY KEY ("id")
);

INSERT INTO "configuration" ("keyname", "valuefield", "category", "datatype")
VALUES
    ('location_lon', '11.0', 'map', 'DOUBLE'),
    ('location_lat', '52.1', 'map', 'DOUBLE'),
    ('city', 'Wolfsburg', 'general', 'STRING'),
    ('trash.token', '', 'datasources', 'STRING'),
    ('trash.url', 'https://www.was-wob.de/apiNodes', 'datasources', 'STRING'),
    ('wastedetection.hostname', 'localhost', 'datasources', 'STRING'),
    ('wastedetection.port', '6379', 'datasources', 'INTEGER'),
    ('wastedetection.stream.aggregator', 'aggregator', 'datasources', 'STRING'),
    ('wastedetection.stream.positionsource', 'positionsource', 'datasources', 'STRING'),
    ('wastedetection.stream.detection', 'objectdetector', 'datasources', 'STRING');