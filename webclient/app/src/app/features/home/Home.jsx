import {Typography} from '@mui/material';
import React, {useEffect, useMemo, useState} from "react";
import HeatmapLayerMap from '../../commons/geographicalMaps/HeatmapLayerMap';
import DetectionCountRest from "../../services/DetectionCountRest";
import FeatureCollectorRest from '../../services/FeatureCollectorRest';

const VIEW_STATE = {
    longitude: 10.716988775029739, // Initial longitude
    latitude: 52.41988232741599    // Initial latitude
};

function Home() {
    const [data, setData] = useState([]);
    const detectionCountRest = useMemo(() => new DetectionCountRest(), []);
    const [features, setFeatures] = useState([]);
    const featureCollectorRest = useMemo(() => new FeatureCollectorRest(), []);
    const [objectClasses, setObjectClasses] = useState([]);
    const [selectedTimeFilter, setSelectedTimeFilter] = useState(24);


    useEffect(() => {
        reloadDetectionCounts();
        reloadFeatures();
        reloadObjectClasses();
    }, []);

    const selectedTimeRange = useMemo(() => {
        reloadDetectionCounts(selectedTimeFilter);
        return selectedTimeFilter;
    }, [selectedTimeFilter]);

    function reloadDetectionCounts(timeFilter) {
        if (timeFilter === undefined) {
            timeFilter = 24;
        }
        const end = Date.now();
        const start = new Date((new Date()).getTime() - timeFilter * 60 * 60 * 1000).getTime();
        detectionCountRest.findByTimeFrame(Math.floor(start / 1000), Math.floor(end / 1000)).then(response => handleLoadDecisions(response));
    }

    function reloadObjectClasses() {
        detectionCountRest.getObjectClasses().then(response => {
            setObjectClasses(response.data);
        });
    }

    function handleLoadDecisions(response) {
        if (response.data == null) {
            return;
        }
        setData(response.data)
    }

    function reloadFeatures() {
        featureCollectorRest.findAll().then(response => handleLoadFeatures(response));
    }

    function handleLoadFeatures(response) {
        if (response.data == null) {
            return;
        }

        var list = response.data.features;
        const groupedFeatures = list.reduce((acc, feature) => {
            const objectType = feature.properties.objectTypeLabel;
            if (!acc[objectType]) {
                acc[objectType] = [];
            }
            acc[objectType].push(feature);
            return acc;
        }, {});

        setFeatures(groupedFeatures);
    }

    return (
        <>
            <HeatmapLayerMap
                latitude={VIEW_STATE.latitude}
                longitude={VIEW_STATE.longitude}
                selectedTimeFilter={selectedTimeRange}
                onTimeFilterChange={setSelectedTimeFilter}
                data={data}
                features={features}
                objectClasses={objectClasses}
            />
            <Typography
                variant="h1"
                component="div"
                noWrap
                sx={{
                    position: 'relative',
                }}
            >
                Welcome!
            </Typography >
        </>
    );
};

export default Home;