import {deDE, enUS} from '@mui/x-data-grid/locales';
import dayjs from 'dayjs';
import {useContext, useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";

import VehicleFilter from "../../../commons/filter/VehicleFilter";
import VehicleRouteMap from "../../../commons/geographicalMaps/VehicleRouteMap";
import VehicleDataRest from '../../../services/VehicleDataRest';
import VehicleRoutesRest from '../../../services/VehicleRoutesRest';
import DateTimeFilter from '../../../commons/filter/DateTimeFilter';
import FilterLayout from '../../../commons/filter/FilterLayout';
import {FilterContext} from '../../../commons/FilterProvider';

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
    const [prevSelectedVehicleData, setPrevSelectedVehicleData] = useState([]);
    const {date} = useContext(FilterContext);
    const [routes, setRoutes] = useState([]);

    useEffect(() => {
        loadVehicleData();
    }, []);

    useEffect(() => {
        reloadAllRouteData();
    }, [date]);

    useEffect(() => {
        reloadPartialVehicleRouteData();
        setPrevSelectedVehicleData(selectedVehicleData);
    }, [selectedVehicleData]);


    function loadVehicleData() {
        vehicleDataRest.findAllFormatted().then(response => {
            if (response.data == null) {
                return;
            }
            const sortedData = response.data.sort((a, b) => a.name.localeCompare(b.name));
            setVehicleData(sortedData);
        });
    }

    function reloadPartialVehicleRouteData() {
        if (selectedVehicleData.length === 0) {
            setRoutes({});
            return;
        }
        const addedVehicles = selectedVehicleData.filter(v => !prevSelectedVehicleData.includes(v));
        const removedVehicles = prevSelectedVehicleData.filter(v => !selectedVehicleData.includes(v));
        const tmpRoutes = Object.keys(routes)
            .filter(vehicle => !removedVehicles.includes(vehicle))
            .reduce((obj, vehicle) => {
                obj[vehicle] = routes[vehicle];
                return obj;
            }, {});

        updateRoutes(addedVehicles, tmpRoutes);
    }

    function reloadAllRouteData() {
        if (selectedVehicleData.length === 0) {
            setRoutes({});
            return;
        }
        const tmpRoutes = {};
        updateRoutes(selectedVehicleData, tmpRoutes);
    }


    function updateRoutes(addedVehicles, tmpRoutes) {
        if (addedVehicles.length === 0) {
            setRoutes(tmpRoutes);
            return;
        }
        const promises = addedVehicles.map(vehicle => vehicleRoutesRest.findAllByVehicleAndWeek(vehicle, date.year(), date.week())
            .then(response => ({vehicle, data: response.data || []}))
        );

        Promise.all(promises).then(results => {
            results.forEach(({vehicle, data}) => {
                tmpRoutes[vehicle] = data;
            });
            setRoutes(tmpRoutes);
        });
    }

    return (
        <>
            <FilterLayout leftPosition={250}>
                <DateTimeFilter
                />
                <VehicleFilter
                    vehicleData={vehicleData}
                    selectedVehicleData={selectedVehicleData}
                    onSelectedVehicleDataChange={setSelectedVehicleData}
                />
            </FilterLayout>
            <VehicleRouteMap
                viewState={DEFAULT_VIEW_STATE}
                routes={routes}
            />
        </>
    );
}

export default VehicleRoutes