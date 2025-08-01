import {MapView} from '@deck.gl/core';

export const MAP_VIEW = new MapView({repeat: true});

export const DEFAULT_VIEW_STATE = {
    longitude: 10.716988775029739,
    latitude: 52.41988232741599,
    zoom: 5,
    pitch: 0,
    bearing: 0
};

export const TILE_LAYER_CONFIG = {
    data: "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
    minZoom: 0,
    maxZoom: 19,
    tileSize: 256
};

export const HEATMAP_COLOR_RANGES = {
    redScale: [
        [239, 59, 44, 200],
        [203, 24, 29, 200],
        [165, 15, 21, 200],
        [103, 0, 13, 200],
    ],
    yellowToRed: [
        [255, 255, 178, 200],
        [254, 217, 118, 200],
        [254, 178, 76, 200],
        [253, 141, 60, 200],
        [240, 59, 32, 200],
        [189, 0, 38, 200],
    ]
};
