import {useState, useMemo, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {deDE, enUS} from '@mui/x-data-grid/locales';

import VehicleDataRest from '../../services/VehicleDataRest';
import VehicleRoutesRest from '../../services/VehicleRoutesRest';
import {MapLayerFactory} from "../../commons/geographicalMaps/MapLayerFactory";
import VehicleFilter from "../../commons/geographicalMaps/VehicleFilter";
import {MAP_VIEW} from '../../commons/geographicalMaps/BaseMapConfig';
import DeckGL from "@deck.gl/react";

const DEFAULT_VIEW_STATE = {
    longitude: 10.779998775029739,
    latitude: 52.41988232741599,
    zoom: 12,
    pitch: 0,
    bearing: 0
};

function VehicleRoutes() {

    const {t, i18n} = useTranslation();
    const locale = i18n.language == "de" ? deDE : enUS
    const vehicleDataRest = useMemo(() => new VehicleDataRest(), []);
    const vehicleRoutesRest = useMemo(() => new VehicleRoutesRest(), []);
    const [vehicleData, setVehicleData] = useState([]);
    const [selectedVehicleData, setSelectedVehicleData] = useState([]);
    const [selectedTimeFilter, setSelectedTimeFilter] = useState(12);
    const [routes, setRoutes] = useState([]);

    useEffect(() => {
        loadVehicleData();
    }, []);

    function loadVehicleData() {
        vehicleDataRest.findAll().then(response => {
            if (response.data == null) {
                return;
            }
            for (const vehicle of response.data) {
                vehicle.lastUpdate = new Date(vehicle.lastUpdate).toLocaleString();
                const now = new Date();
                const diffInSeconds = ((now - new Date(vehicle.lastUpdate)) / 1000);
                vehicle.status = diffInSeconds <= 30 ? "online" : "offline";
            }

            const sortedData = response.data.sort((a, b) => a.name.localeCompare(b.name));
            setVehicleData(sortedData);
        });
    }

    const selectedVehicles = useMemo(() => {
        reloadRouteData(selectedVehicleData);
        return selectedVehicleData;
    }, [selectedVehicleData]);

    function reloadRouteData(selectedVehicleData) {
        if (selectedVehicleData.length == 0) {
            setRoutes({});
            return;
        }
        // load only last 12 hours
        const timeFilter = selectedTimeFilter;
        const end = new Date();
        const start = new Date((new Date()).getTime() - timeFilter * 60 * 60 * 1000).getTime();

        const promises = selectedVehicleData.map(vehicle =>
            vehicleRoutesRest.findAllByVehicleAndTimeframe(vehicle, Math.floor(start / 1000), Math.floor(end / 1000))
                .then(response => ({vehicle, data: response.data || []}))
        );

        Promise.all(promises).then(results => {
            const tmpRoutes = {};
            results.forEach(({vehicle, data}) => {
                tmpRoutes[vehicle] = data;
            });
            setRoutes(tmpRoutes);
        });
    }

    const layers = useMemo(() => {
        var result = []
        result.push(MapLayerFactory.createBaseMapLayer());
        for (const vehicle in routes) {
            if (routes[vehicle] && routes[vehicle].length > 0) {
                result.push(MapLayerFactory.createRouteLayer(routes[vehicle], vehicle));
            }
        }
        return result;
    }, [routes]);

    return (
        <>
            <VehicleFilter
                vehicleData={vehicleData}
                selectedVehicleData={selectedVehicles}
                onSelectedVehicleDataChange={setSelectedVehicleData}
                timeFilter={selectedTimeFilter}
                onTimeFilterChange={setSelectedTimeFilter}
            />
            <DeckGL
                layers={layers}
                views={MAP_VIEW}
                initialViewState={DEFAULT_VIEW_STATE}
                controller={{dragRotate: false}}
            />
        </>
    );
}

export default VehicleRoutes