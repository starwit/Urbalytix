CREATE SEQUENCE IF NOT EXISTS "city_district_id_seq";


CREATE TABLE IF NOT EXISTS city_district
(
    city character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    gmlid integer,
    district_government character varying(255),
    district_geometry geometry NOT NULL,
    id bigint NOT NULL DEFAULT nextval('city_district_id_seq'),
    CONSTRAINT city_district_pkey PRIMARY KEY (id)
)