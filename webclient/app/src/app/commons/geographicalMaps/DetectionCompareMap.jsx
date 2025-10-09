import DeckGL from "@deck.gl/react";
import {useTranslation} from "react-i18next";
import {MAP_VIEW} from './BaseMapConfig';
import {MapLayerFactory} from './MapLayerFactory';

function DetectionCompareMap(props) {
    const {
        viewState,
        detectionData = [],
        detectionComparitionData = [],
        vehicleRoutes = [],
        showCoverage = false,
        showHexagons = false,
    } = props;
    const {t} = useTranslation();

    function getTooltip({object, layer}) {
        if (!object) {
            return null;
        }
        let lat = 0;
        let lng = 0;
        let count = 0;
        let detectionTimes = [];

        if (layer.id.startsWith('hex')) {
            if (object.position) {
                if (object.points && object.points.length > 0) {
                    lat = object.points[0].latitude;
                    lng = object.points[0].longitude;
                }
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
        }
        if (layer.id === 'CoverageLayer') {
            if (object.count) {
                count = object.count;
            }
            return {
                html: `
                        <div>
                            <strong>${t('map.detectioncount')}:</strong> ${count}<br />
                        </div>
                        `
            };
        }
    }

    const layers = [
        MapLayerFactory.createBaseMapLayer()
    ];
    if (showCoverage) {
        layers.push(MapLayerFactory.createCoverageLayer(vehicleRoutes));
    }
    if (showHexagons) {
        layers.push(MapLayerFactory.createComparisionLayers(detectionData, detectionComparitionData));
    }



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

export default DetectionCompareMap;
