import {TileLayer} from "@deck.gl/geo-layers";
import {BitmapLayer, IconLayer} from "@deck.gl/layers";
import DeckGL from "@deck.gl/react";
import {HeatmapLayer} from "@deck.gl/aggregation-layers";



function HeatmapLayerMap(props) {
    const {latitude, longitude, data} = props;
    const INITIAL_VIEW_STATE = {
        longitude: longitude,
        latitude: latitude,
        zoom: 19,
        pitch: 0,
        bearing: 0
    };

    const colorRangeYR = [
        [255, 255, 178, 200], // Light Yellow
        [254, 217, 118, 200],   // Yellow
        [254, 178, 76, 200],   // Orange-Yellow
        [253, 141, 60, 200],   // Orange
        [240, 59, 32, 200],   // Orange-Red
        [189, 0, 38, 200],     // Red
    ]

    const colorRangeR = [
        [239, 59, 44, 200],
        [203, 24, 29, 200],
        [165, 15, 21, 200],
        [103, 0, 13, 200],
    ]

    const layers = [
        new TileLayer({
            data: "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
            minZoom: 0,
            maxZoom: 19,
            tileSize: 256,

            renderSubLayers: props => {
                const {
                    bbox: {west, south, east, north}
                } = props.tile;

                return new BitmapLayer(props, {
                    data: null,
                    image: props.data,
                    bounds: [west, south, east, north]
                });
            }
        }),
        new HeatmapLayer({
            id: 'HeatmapLayer',
            data: data,
            aggregation: 'SUM',
            getPosition: d => [d.longitude, d.latitude],
            getWeight: d => d.count,
            colorRange: colorRangeR,
            radiusPixels: 25
        })
    ];

    return (
        <DeckGL
            layers={layers}
            initialViewState={INITIAL_VIEW_STATE}
            controller={{dragRotate: false}}
        >
        </DeckGL >
    );
}

export default HeatmapLayerMap;

