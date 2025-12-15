CREATE INDEX IF NOT EXISTS idx_detection_location_geom
    ON detection_count USING GIST (location);

CREATE INDEX IF NOT EXISTS idx_street_path_geom
    ON street_catalog USING GIST (street_path);