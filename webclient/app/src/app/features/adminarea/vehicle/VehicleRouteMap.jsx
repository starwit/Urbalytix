import DeckGL from "@deck.gl/react";
import {useMemo} from "react";
import {MapLayerFactory} from '../../../commons/geographicalMaps/MapLayerFactory';
import {MAP_VIEW} from '../../../commons/geographicalMaps/BaseMapConfig';
import positionImage from "../../../assets/icons/vehicle.png";

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
    const {
        viewState,
        onViewStateChange,
        routes = [],
        districts,
        showDistricts = false,
        positionIcon = positionImage,
        positionData = [],
    } = props;

    var layers = [
        MapLayerFactory.createBaseMapLayer(),
        MapLayerFactory.createDistrictLayer(districts, showDistricts, false, () => { }),
        MapLayerFactory.createPositionLayer(positionData, ICON_MAPPING, positionIcon, true),
    ];

    for (const vehicle in routes) {
        if (routes[vehicle] && routes[vehicle].length > 0) {
            layers.push(MapLayerFactory.createRouteLayer(routes[vehicle], vehicle));
        }
    }

    return (
        <>
            <DeckGL
                layers={layers}
                onViewStateChange={onViewStateChange}
                views={MAP_VIEW}
                initialViewState={viewState}
                controller={true}
            />
        </>
    );
}

export default VehicleRouteMap;
