CREATE SEQUENCE IF NOT EXISTS "street_catalog_id_seq";

CREATE TABLE IF NOT EXISTS "street_catalog"
(
    "city" character varying(255) NOT NULL,
    "street_name" character varying(255) NOT NULL,
    "street_path" geometry NOT NULL,
    "id" BIGINT NOT NULL DEFAULT nextval('street_catalog_id_seq'),
    CONSTRAINT "street_catalog_pkey" PRIMARY KEY ("id")
)