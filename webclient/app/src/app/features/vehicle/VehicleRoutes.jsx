import {useState, useMemo, useEffect} from "react";
import dayjs from 'dayjs';
import {useTranslation} from "react-i18next";
import {deDE, enUS} from '@mui/x-data-grid/locales';

import VehicleDataRest from '../../services/VehicleDataRest';
import VehicleRoutesRest from '../../services/VehicleRoutesRest';
import {MapLayerFactory} from "../../commons/geographicalMaps/MapLayerFactory";
import VehicleFilter from "../../commons/geographicalMaps/VehicleFilter";
import {TimeFunctions} from "../../commons/geographicalMaps/TimeFunctions";
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
    const [selectedDate, setSelectedDate] = useState(dayjs(new Date()));
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

        vehicleRoutesRest.findAvailableTimeFrames().then(response => {
            if (response.data == null) {
                return;
            }
        });
    }

    const selectedVehicles = useMemo(() => {
        reloadRouteData(selectedVehicleData);
        return selectedVehicleData;
    }, [selectedVehicleData]);

    function reloadRouteData(selectedVehicleData, date) {
        if (selectedVehicleData.length == 0) {
            setRoutes({});
            return;
        }
        const promises = selectedVehicleData.map(vehicle =>
            vehicleRoutesRest.findAllByVehicleAndWeek(vehicle, selectedDate.year(), selectedDate.week())
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

    function onTimeChange(date) {
        setSelectedDate(date);
        setRoutes({});
        reloadRouteData(selectedVehicles, date);
    }

    return (
        <>
            <VehicleFilter
                vehicleData={vehicleData}
                selectedVehicleData={selectedVehicles}
                onSelectedVehicleDataChange={setSelectedVehicleData}
                onTimeChange={onTimeChange}
                selectedDate={selectedDate}
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