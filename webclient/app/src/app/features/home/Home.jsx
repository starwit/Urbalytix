import {Typography} from '@mui/material';
import React, {useEffect, useMemo, useState} from "react";
import HeatmapLayerMap from '../../commons/geographicalMaps/HeatmapLayerMap';
import DetectionCountRest from "../../services/DetectionCountRest";

const VIEW_STATE = {
    longitude: -86.1352523571874,
    latitude: 39.96476671476241
    //longitude: 10.716988775029739, // Initial longitude
    //latitude: 52.41988232741599,    // Initial latitude
};

function Home() {
    const [data, setData] = React.useState([]);
    const detectionCountRest = React.useMemo(() => new DetectionCountRest(), []);


    useEffect(() => {
        reloadDecisions();
        const interval = setInterval(reloadDecisions, 5000); // Update alle 5 Sekunden
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

    return (
        <>
            <HeatmapLayerMap
                latitude={VIEW_STATE.latitude}
                longitude={VIEW_STATE.longitude}
                data={data}
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