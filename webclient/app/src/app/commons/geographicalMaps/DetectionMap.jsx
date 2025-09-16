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
    const {viewState, detectionData = [], features = [], featureIcon = featureImage, positionData = [], positionIcon = positionImage, showPosition = false, showHeatmap = false, showHexagons = true} = props;

    function getTooltip({object}) {
        if (!object) {
            return null;
        }
        let lat = 0;
        let lng = 0;
        if (object.position) {
            lat = object.position[0];
            lng = object.position[1];
        }
        console.log(object);
        const count = object.elevationValue;
        let detectionTimes = 0;
        detectionTimes = object.points ? [...new Set(object.points.map(d => d.detectionTime))] : [];

        return {
            html: `
                <div>
                    <strong>Latitude:</strong> ${lat}<br />
                    <strong>Longitude:</strong> ${lng}<br />
                    <strong>Maximum detected Objects:</strong> ${count}<br />
                    <strong>Detections:</strong> ${detectionTimes.length} <br />
                    <strong>Time:</strong> <br /> ${detectionTimes.join('<br/>')}
                </div>
                `
        };
    }

    const layers = useMemo(() => {

        var result = [
            MapLayerFactory.createBaseMapLayer(),
            ...Object.entries(features).map(([objectType, featureData], index) =>
                MapLayerFactory.createIconLayer(featureData, objectType, index, ICON_MAPPING, featureIcon))
        ];
        if (showHexagons) {
            result.push(MapLayerFactory.createHexagonLayer(detectionData, {
                id: 'HexagonLayer',
            }));
        }
        if (showHeatmap) {
            result.push(MapLayerFactory.createHeatmapDetectionLayer(detectionData, HEATMAP_COLOR_RANGES.redScale, {
                id: 'HeatmapLayer',
            }));
        }

        result.push(MapLayerFactory.createScatterplotLayer(detectionData, 'className', {
            id: 'ScatterplotLayer',
        }));

        if (showPosition) {
            result.push(MapLayerFactory.createPositionLayer(positionData, ICON_MAPPING, positionIcon));
        }



        return result;
    });

    return (
        <>
            <DeckGL
                layers={layers}
                views={MAP_VIEW}
                initialViewState={viewState}
                controller={true}
                getTooltip={getTooltip}
            />
        </>
    );
}

export default DetectionMap;
