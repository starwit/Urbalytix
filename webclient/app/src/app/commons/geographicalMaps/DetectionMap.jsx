import DeckGL from "@deck.gl/react";
import {useMemo} from "react";
import featureImage from "../../assets/icons/recycling.png";
import positionImage from "../../assets/icons/vehicle.png";
import {HEATMAP_COLOR_RANGES, MAP_VIEW} from './BaseMapConfig';
import {MapLayerFactory} from './MapLayerFactory';
import {useTranslation} from "react-i18next";

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
    const {viewState, detectionData = [], features = [], featureIcon = featureImage, positionData = [], positionIcon = positionImage, showPosition = false, showScatterplot = false, showHeatmap = false, showHexagons = false} = props;
    const {t} = useTranslation();

    function getTooltip({object, layer}) {
        if (!object) {
            return null;
        }
        let lat = 0;
        let lng = 0;
        let count = 0;
        let detectionTimes = [];

        switch (layer.id) {
            case 'HexagonLayer':
                if (object.position) {
                    lat = object.position[0];
                    lng = object.position[1];
                }
                if (object.elevationValue) {
                    count = object.elevationValue;
                    detectionTimes = object.points ? [...new Set(object.points.map(d => d.detectionTime))] : [];
                }
                return {
                    html: `
                        <div>
                            <strong>${t('map.latitude')}:</strong> ${lat}<br />
                            <strong>${t('map.longitude')}:</strong> ${lng}<br />
                            <strong>${t('map.maxDetectedObjects')}:</strong> ${count}<br />
                            <strong>${t('map.detections')}:</strong> ${detectionTimes.length} <br />
                            <strong>${t('map.time')}:</strong> <br /> ${detectionTimes.join('<br/>')}
                        </div>
                        `
                };

            case 'ScatterplotLayer':
                if (object.latitude) {
                    lat = object.latitude;
                    lng = object.longitude;
                }
                if (object.count) {
                    count = object.count;
                    detectionTimes.push(object.detectionTime);
                }
                return {
                    html: `
                        <div>
                            <strong>${t('map.latitude')}:</strong> ${lat}<br />
                            <strong>${t('map.longitude')}:</strong> ${lng}<br />
                            <strong>${t('map.detectedObjects')}:</strong> ${count}<br />
                            <strong>${t('map.time')}:</strong> ${detectionTimes.join('<br/>')}
                        </div>
                    `
                };

            default:
                if (layer.id.startsWith('IconLayer')) {
                    return {
                        html: `
                            <div>
                                ${object.name}, ${t(object.status)}<br />
                                ${object.description}<br />
                            </div>
                    `
                    };
                }
        }
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
        if (showScatterplot) {
            result.push(MapLayerFactory.createScatterplotLayer(detectionData, 'className', {
                id: 'ScatterplotLayer',
            }));
        }

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
                getTooltip={({object, layer}) => getTooltip({object, layer})}
            />
        </>
    );
}

export default DetectionMap;
