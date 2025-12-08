import DeckGL from "@deck.gl/react";
import {useMemo} from "react";
import {MapLayerFactory} from '../../../commons/geographicalMaps/MapLayerFactory';
import {MAP_VIEW} from '../../../commons/geographicalMaps/BaseMapConfig';


function VehicleRouteMap(props) {
    const {
        viewState,
        onViewStateChange,
        routes = [],
        districts,
        showDistricts = false
    } = props;

    var layers = [
        MapLayerFactory.createBaseMapLayer(),
        MapLayerFactory.createDistrictLayer(districts, showDistricts)
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
