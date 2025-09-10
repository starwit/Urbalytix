import DeckGL from "@deck.gl/react";
import {useMemo} from "react";
import featureImage from "../../assets/icons/recycling.png";
import positionImage from "../../assets/icons/vehicle.png";
import {HEATMAP_COLOR_RANGES, MAP_VIEW} from './BaseMapConfig';
import {MapLayerFactory} from './MapLayerFactory';

const ICON_MAPPING = {
    "marker": {
        "x": 0,
        "y": 0,
        "width": 128,
        "height": 128,
        "anchorY": 128,
        "mask": true
    },
    "marker-warning": {
        "x": 128,
        "y": 0,
        "width": 128,
        "height": 128,
        "anchorY": 128,
        "mask": false
    }
}

function DetectionMap(props) {
    const {viewState, detectionData, features, featureIcon = featureImage, postionData, positionIcon = positionImage} = props;

    const layers = useMemo(() => {

        var result = [
            MapLayerFactory.createBaseMapLayer(),
            MapLayerFactory.createHeatmapDetectionLayer(detectionData, HEATMAP_COLOR_RANGES.redScale, {
                id: 'HeatmapLayer',
            }),
            ...Object.entries(features).map(([objectType, featureData], index) =>
                MapLayerFactory.createIconLayer(featureData, objectType, index, ICON_MAPPING, featureIcon)
            )
        ];

        result.push(MapLayerFactory.createPositionLayer(postionData, ICON_MAPPING, positionIcon));

        return result;
    });

    return (
        <>
            <DeckGL
                layers={layers}
                views={MAP_VIEW}
                initialViewState={viewState}
                controller={{dragRotate: false}}
            />
        </>
    );
}

export default DetectionMap;
