import 'maplibre-gl/dist/maplibre-gl.css';
import {useTranslation} from "react-i18next";
import positionImage from "../../../assets/icons/vehicle.png";
import BaseMap from '../../../commons/geographicalMaps/BaseMap';
import {MapLayerFactory} from '../../../commons/geographicalMaps/MapLayerFactory';

const ICON_MAPPING = {
    "marker": {
        "x": 0,
        "y": 0,
        "width": 75,
        "height": 75,
        "mask": true
    },
}

function VehicleRouteMap(props) {
    const {t} = useTranslation();
    const {
        viewState,
        onViewStateChange,
        routes = [],
        districts,
        showDistricts = false,
        positionIcon = positionImage,
        positionData = [],
    } = props;

    function renderTooltip({layer, object}) {
        if (!object || !layer) {
            return;
        }

        if (layer.id.startsWith("LineLayer-route-points")) {
            return `${object.timestamp}\n${object.speedKmhAvg.toFixed(2)}km/h`;
        }

        if (layer.id.startsWith("IconLayer-vehicle-positions")) {
            const status = t(`vehicle.status.${object.isOnline ? "online" : "offline"}`);
            return `${object.name}\n${object.lastUpdate}\n${status}`;
        }
    }

    let layers = [
        MapLayerFactory.createDistrictLayer(districts, showDistricts, false, () => { }),
    ];

    for (const vehicle in routes) {
        if (routes[vehicle] && routes[vehicle].length > 0) {
            layers.push(MapLayerFactory.createRouteLayer(routes[vehicle], vehicle));
        }
    }

    layers.push(MapLayerFactory.createPositionLayer(positionData, ICON_MAPPING, positionIcon, true));

    return (
        <BaseMap 
            layers={layers}
            viewState={viewState}
            onViewStateChange={onViewStateChange}
            getTooltip={renderTooltip}
        />
    );
}

export default VehicleRouteMap;
