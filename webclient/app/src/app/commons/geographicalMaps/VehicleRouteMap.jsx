import DeckGL from "@deck.gl/react";
import {useMemo} from "react";
import {MapLayerFactory} from './MapLayerFactory';
import {MAP_VIEW} from './BaseMapConfig';


function VehicleRouteMap(props) {
    const {
        viewState,
        routes = []
    } = props;

    const layers = useMemo(() => {

        var result = [
            MapLayerFactory.createBaseMapLayer(),
        ];

        for (const vehicle in routes) {
            if (routes[vehicle] && routes[vehicle].length > 0) {
                result.push(MapLayerFactory.createRouteLayer(routes[vehicle], vehicle));
            }
        }
        return result;
    }, [routes]);

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

export default VehicleRouteMap;
