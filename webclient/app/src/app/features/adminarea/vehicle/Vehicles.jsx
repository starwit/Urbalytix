import {deDE, enUS} from '@mui/x-data-grid/locales';
import {useContext, useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";

import VehicleRouteMap from "../../../commons/geographicalMaps/VehicleRouteMap";
import VehicleDataRest from '../../../services/VehicleDataRest';
import VehicleRoutesRest from '../../../services/VehicleRoutesRest';
import ConfigurationRest from "../../../services/ConfigurationRest";
import {useDistricts} from "../../hooks/useCityDistricts";
import DateTimeFilter from '../../../commons/filter/DateTimeFilter';
import FilterLayout from '../../../commons/filter/FilterLayout';
import {FilterContext} from '../../../commons/FilterProvider';
import VehicleTable from './VehicleTable';
import StreetTableLayout from '../streetcatalog/StreetTableLayout';
import VehicleMapMenu from './VehicleMapMenu';

function Vehicles() {
    const {t, i18n} = useTranslation();
    const locale = i18n.language == "de" ? deDE : enUS
    const {showDistricts, setShowDistricts, types, setTypes} = useContext(FilterContext);
    const is3d = types.includes("3d");
    const vehicleDataRest = useMemo(() => new VehicleDataRest(), []);
    const vehicleRoutesRest = useMemo(() => new VehicleRoutesRest(), []);
    const configurationRest = useMemo(() => new ConfigurationRest(), []);
    const [city, setCity] = useState('');
    const [viewState, setViewState] = useState({
        longitude: 10.785000000000000,
        latitude: 52.41788232741599,
        zoom: 15,
        pitch: is3d ? 60 : 0,
        bearing: 0
    });
    const [vehicleData, setVehicleData] = useState([]);
    const [selectedVehicleData, setSelectedVehicleData] = useState([]);
    const [prevSelectedVehicleData, setPrevSelectedVehicleData] = useState([]);
    const {date} = useContext(FilterContext);
    const [routes, setRoutes] = useState([]);
    const [showDataTable, setShowDataTable] = useState(false);
    const {districts} = useDistricts({showDistricts});

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

    useEffect(() => {
        configurationRest.getMapCenter().then(response => {
            setViewState(v => ({
                ...v,
                longitude: response.data.geometry.coordinates[0],
                latitude: response.data.geometry.coordinates[1],
            }));
            setCity(response.data.properties['city']);
        });
    }, []);

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

    function handleTypes(event, newTypes) {
        if (newTypes.length) {
            setTypes(newTypes);
        }
    }

    function toggleDataTable() {
        setShowDataTable(!showDataTable);
    }

    return (
        <>
            <FilterLayout leftPosition={10}>
                <DateTimeFilter />
            </FilterLayout>
            <VehicleMapMenu
                types={types}
                handleTypes={handleTypes}
                setViewState={setViewState}
                showDataTable={toggleDataTable}
                setShowDistricts={setShowDistricts}
            />
            <VehicleRouteMap
                viewState={viewState}
                onViewStateChange={({viewState}) => setViewState(viewState)}
                routes={routes}
                showDistricts={showDistricts}
                districts={districts}
            />
            <StreetTableLayout>
                <VehicleTable
                    showDataTable={showDataTable}
                    selectedVehicleData={selectedVehicleData}
                    onSelectedVehicleDataChange={setSelectedVehicleData}
                />
            </StreetTableLayout>
        </>
    );
}

export default Vehicles