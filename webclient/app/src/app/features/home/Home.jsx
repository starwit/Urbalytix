import {Typography} from '@mui/material';
import React from 'react';
import HeatmapLayerMap from '../../commons/geographicalMaps/HeatmapLayerMap';

const VIEW_STATE = {
    longitude: -122.4,
    latitude: 37.74
    //longitude: 10.716988775029739, // Initial longitude
    //latitude: 52.41988232741599,    // Initial latitude
};

function Home() {

    return (
        <>
            <HeatmapLayerMap
                latitude={VIEW_STATE.latitude}
                longitude={VIEW_STATE.longitude}
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