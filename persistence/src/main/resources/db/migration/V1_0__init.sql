CREATE SEQUENCE IF NOT EXISTS "decision_id_seq";

CREATE TABLE "decision"
(
    "acquisitiontime" TIMESTAMP WITH TIME ZONE,
    "cameralatitude" DECIMAL(22,19),
    "cameralongitude" DECIMAL(22,19),
    "description" VARCHAR(255),
    "id" BIGINT NOT NULL DEFAULT nextval('decision_id_seq'),
    CONSTRAINT "decision_pkey" PRIMARY KEY ("id")
);

CREATE SEQUENCE IF NOT EXISTS "action_id_seq";

