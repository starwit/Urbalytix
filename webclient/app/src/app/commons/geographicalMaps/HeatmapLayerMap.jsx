import DeckGL from "@deck.gl/react";
import {useEffect, useState} from "react";
import {MapLayerFactory} from './MapLayerFactory';
import {MAP_VIEW, HEATMAP_COLOR_RANGES} from './BaseMapConfig';
import recyclingImage from "../../assets/icons/recycling.png"
import MapFilter from "./MapFilter";

const ICON_MAPPING_URL = 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.json';

function HeatmapLayerMap(props) {
    const {latitude, longitude, data, features} = props;



    const INITIAL_VIEW_STATE = {
        longitude,
        latitude,
        zoom: 19,
        pitch: 0,
        bearing: 0
    };


    const [iconMapping, setIconMapping] = useState(null);

    useEffect(() => {
        fetch(ICON_MAPPING_URL)
            .then(res => res.json())
            .then(data => setIconMapping(data))
            .catch(err => console.error('Failed to load icon mapping', err));
    }, []);

    const layers = [
        MapLayerFactory.createBaseMapLayer(),
        MapLayerFactory.createHeatmapLayer(data, HEATMAP_COLOR_RANGES.redScale, {
            id: 'HeatmapLayer',
            getWeight: d => d.count,
            radiusPixels: 25
        }),
        ...Object.entries(features).map(([objectType, featureList], index) =>
            MapLayerFactory.createIconLayer(featureList, objectType, index, iconMapping, recyclingImage)
        )
    ];

    return (
        <>
            <MapFilter
                selectedType={[]}
                decisionTypes={[]}
                selected={[]}
            />
            <DeckGL
                layers={layers}
                views={MAP_VIEW}
                initialViewState={INITIAL_VIEW_STATE}
                controller={{dragRotate: false}}
            />
        </>
    );
}

export default HeatmapLayerMap;
