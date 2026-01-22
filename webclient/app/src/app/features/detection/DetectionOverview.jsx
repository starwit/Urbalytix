import {deDE, enUS} from '@mui/x-data-grid/locales';
import {useContext, useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import DataFilter from "../../commons/filter/DataFilter";
import DateTimeFilter from "../../commons/filter/DateTimeFilter";
import FeatureFilter from "../../commons/filter/FeatureFilter";
import FilterLayout from "../../commons/filter/FilterLayout";
import ObjectClassFilter from "../../commons/filter/ObjectClassFilter";
import {FilterContext} from '../../commons/FilterProvider';
import ConfigurationRest from "../../services/ConfigurationRest";
import {useDistricts} from "../hooks/useCityDistricts";
import {useDetectionCount} from "../hooks/useDetectionCount";
import {useFeatures} from "../hooks/useFeatures";
import {useObjectClasses} from "../hooks/useObjectClasses";
import {useVehicleData} from "../hooks/useVehicleData";
import {useVehicleRoutes} from "../hooks/useVehicleRoutes";
import DetectionMap from './DetectionMap';
import DetectionMapMenu from "./DetectionMapMenu";
import DetectionDistrictTable from "./DetectionDistrictTable";
import DetectionStreetTable from "./DetectionStreetTable";

const DATA_FILTERS = [
    {value: 0, label: 'selection.currentPosition'},
]

function DetectionOverview() {
    const {t, i18n} = useTranslation();
    const locale = i18n.language == "de" ? deDE : enUS;
    const {showDistricts, setShowDistricts, types, setTypes} = useContext(FilterContext);
    const is3d = types.includes("3d");
    const [viewState, setViewState] = useState({
        longitude: 10.785000000000000,
        latitude: 52.41788232741599,
        zoom: 15,
        pitch: is3d ? 60 : 0,
        bearing: 0
    });

    const {
        detectionData
    } = useDetectionCount();

    const vehicleData = useVehicleData(2000);
    const handleObjectClasses = useObjectClasses();

    const [selectedFilterLabels, setSelectedFilterLabels] = useState([DATA_FILTERS[0].label]);
    const {
        features,
        selectedFeatureKeys,
        setSelectedFeatureKeys,
        selectedFeatures
    } = useFeatures();

    const {districts} = useDistricts({showDistricts});
    const vehicleRoutes = useVehicleRoutes();

    const configurationRest = useMemo(() => new ConfigurationRest(), []);

    // to reposition map center according to data table height
    const [city, setCity] = useState('');
    const [showDataTable, setShowDataTable] = useState(false);
    const [showStreetData, setShowStreetData] = useState(false);
    const [districtId, setDistrictId] = useState(1);
    const [districtName, setDistrictName] = useState('');

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

    function handleTypes(event, newTypes) {
        if (newTypes.length) {
            setTypes(newTypes);
        }
    }

    function toggleDataTable() {
        setShowDataTable(!showDataTable);
    }

    function handleDistrictDetailsClick(params) {
        if (districtId === params.id) {
            return;
        } else {
            setShowStreetData(false);
            handleBackClick();
            setDistrictId(params.id);
            setDistrictName(params.districtName);
            setShowStreetData(true);
        }
    }

    function handleBackClick() {
        setShowStreetData(false);
    }

    function displayTable() {
        if (showDataTable) {
            if (showStreetData) {
                return <DetectionStreetTable
                    showDataTable={showDataTable}
                    districtId={districtId}
                    districtName={districtName}
                    city={city}
                    handleBackClick={handleBackClick}
                />
            } else {
                return <DetectionDistrictTable
                    showDataTable={showDataTable}
                    city={city}
                    handleDistrictDetailsClick={handleDistrictDetailsClick}
                />
            }
        } else {
            return <></>
        }
    }

    return (
        <>
            <FilterLayout leftPosition={10}>
                <DateTimeFilter
                    additionalLogic={(curStartDate, curEndDate, changed) => {
                        handleObjectClasses.loadObjectClasses(curStartDate, curEndDate, changed);
                    }}
                />
                <ObjectClassFilter
                    prefix='detectiondata'
                />
                <DataFilter
                    prefix='vehicle'
                    filters={DATA_FILTERS}
                    selectedFilterLabels={selectedFilterLabels}
                    onSelectedFilterLabels={setSelectedFilterLabels}
                />
                <FeatureFilter
                    availableFeatureKeys={Object.keys(features)}
                    selectedFeatureKeys={selectedFeatureKeys}
                    onSelectedFeatureChange={setSelectedFeatureKeys}
                />
            </FilterLayout>

            <DetectionMapMenu
                types={types}
                handleTypes={handleTypes}
                setViewState={setViewState}
                showDataTable={toggleDataTable}
                setShowDistricts={setShowDistricts}
            />

            <DetectionMap
                viewState={viewState}
                onViewStateChange={({viewState}) => setViewState(viewState)}
                detectionData={detectionData}
                vehicleRoutes={vehicleRoutes}
                features={selectedFeatures}
                districts={districts}
                districtClick={handleDistrictDetailsClick}
                positionData={vehicleData}
                showPosition={selectedFilterLabels.includes("selection.currentPosition")}
                showHeatmap={types.includes("heatmap")}
                showHexagons={types.includes("hexagon")}
                showScatterplot={types.includes("scatterplot")}
                showCoverage={types.includes("coverage")}
                showDistricts={showDistricts}
            />
            {displayTable()}
        </>
    );
}

export default DetectionOverview;