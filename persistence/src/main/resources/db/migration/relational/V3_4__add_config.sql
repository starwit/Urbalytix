CREATE SEQUENCE IF NOT EXISTS "configuration_id_seq";

CREATE TABLE "configuration"
(
    "keyname" VARCHAR(255) NOT NULL,
	"valuefield" VARCHAR(1024) NOT NULL,
	"category" VARCHAR(255) NOT NULL,
    "id" BIGINT NOT NULL DEFAULT nextval('configuration_id_seq'),
    CONSTRAINT "configuration_unique_key" UNIQUE("keyname"),
    CONSTRAINT "configuration_pkey" PRIMARY KEY ("id")
);