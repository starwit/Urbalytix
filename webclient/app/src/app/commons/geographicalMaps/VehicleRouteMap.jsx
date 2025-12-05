import DeckGL from "@deck.gl/react";
import {useMemo} from "react";
import {MapLayerFactory} from './MapLayerFactory';
import {MAP_VIEW} from './BaseMapConfig';


function VehicleRouteMap(props) {
    const {
        viewState,
        onViewStateChange,
        routes = [],
        districts,
        showDistricts = false
    } = props;

    const layers = [
        MapLayerFactory.createBaseMapLayer(),
    ];

    if (showDistricts) {
        layers.push(MapLayerFactory.createDistrictLayer(districts));
    }

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
