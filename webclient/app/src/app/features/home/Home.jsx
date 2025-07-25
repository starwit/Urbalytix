import {Typography} from '@mui/material';
import React, {useEffect, useMemo, useState} from "react";
import HeatmapLayerMap from '../../commons/geographicalMaps/HeatmapLayerMap';
import DetectionCountRest from "../../services/DetectionCountRest";
import FeatureCollectorRest from '../../services/FeatureCollectorRest';

const VIEW_STATE = {
    //longitude: -86.12679199569024,
    //latitude: 39.95841206473967
    longitude: 10.716988775029739, // Initial longitude
    latitude: 52.41988232741599    // Initial latitude
};

function Home() {
    const [data, setData] = useState([]);
    const detectionCountRest = useMemo(() => new DetectionCountRest(), []);
    const [features, setFeatures] = useState([]);
    const featureCollectorRest = useMemo(() => new FeatureCollectorRest(), []);


    useEffect(() => {
        reloadDecisions();
        reloadFeatures();
        const interval = setInterval(reloadDecisions, 5000); // Update every five seconds
        return () => clearInterval(interval);
    }, []);

    function reloadDecisions() {
        detectionCountRest.findAll().then(response => handleLoadDecisions(response));
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
        setFeatures(response.data)
    }

    return (
        <>
            <HeatmapLayerMap
                latitude={VIEW_STATE.latitude}
                longitude={VIEW_STATE.longitude}
                data={data}
                features={features}
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