CREATE SEQUENCE IF NOT EXISTS "detection_count_id_seq";

CREATE TABLE "detection_count"
(
    "detection_time" TIMESTAMP WITH TIME ZONE,
    "latitude" DECIMAL(22,19),
    "longitude" DECIMAL(22,19),
    "count" SMALLINT NOT NULL,
    "class_id" SMALLINT NOT NULL,
    "id" BIGINT NOT NULL DEFAULT nextval('detection_count_id_seq'),
    CONSTRAINT "decision_pkey" PRIMARY KEY ("id")
);

CREATE SEQUENCE IF NOT EXISTS "action_id_seq";

