import {Typography} from '@mui/material';
import React from 'react';
import IconLayerMap from '../../commons/geographicalMaps/IconLayerMap';

const VIEW_STATE = {
    longitude: 10.716988775029739, // Initial longitude
    latitude: 52.41988232741599,    // Initial latitude
    zoom: 5,                        // Initial zoom level
};

function Home() {

    return (
        <>
            <IconLayerMap
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