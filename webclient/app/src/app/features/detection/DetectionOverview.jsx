import {use, useState, useEffect, useMemo} from "react";
import DataFilter from "../../commons/filter/DataFilter";
import DateTimeFilter from "../../commons/filter/DateTimeFilter";
import FeatureFilter from "../../commons/filter/FeatureFilter";
import FilterLayout from "../../commons/filter/FilterLayout";
import ObjectClassFilter from "../../commons/filter/ObjectClassFilter";
import DetectionMap from './DetectionMap';
import DetectionMapMenu from "./DetectionMapMenu";
import {useDistricts} from "../hooks/useCityDistricts";
import {useDetectionCount} from "../hooks/useDetectionCount";
import {useFeatures} from "../hooks/useFeatures";
import {useObjectClasses} from "../hooks/useObjectClasses";
import {useVehicleData} from "../hooks/useVehicleData";
import {useVehicleRoutes} from "../hooks/useVehicleRoutes";
import {useTranslation} from "react-i18next";
import StreetCatalogRest from "../../services/StreetCatalogRest";
import {deDE, enUS} from '@mui/x-data-grid/locales';
import StreetTableLayout from "../adminarea/streetcatalog/StreetTableLayout";
import {DataGrid} from "@mui/x-data-grid";

const VIEW_STATE = {
    longitude: 10.785000000000000,
    latitude: 52.41788232741599,
    zoom: 15,
    pitch: 60,
    bearing: 0
};

const DATA_FILTERS = [
    {value: 0, label: 'selection.currentPosition'},
]


function DetectionOverview() {
    const {t, i18n} = useTranslation();
    const locale = i18n.language == "de" ? deDE : enUS;
    const [showDistricts, setShowDistricts] = useState(false);
    const [viewState, setViewState] = useState(VIEW_STATE);
    const [types, setTypes] = useState(['heatmap', 'hexagon', '3d']);

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

    // data table
    const streetCatalogRest = useMemo(() => new StreetCatalogRest(), []);
    const [gridHeight, setGridHeight] = useState(0);
    const [city, setCity] = useState('Wolfsburg');
    const [showDataTable, setShowDataTable] = useState(false);
    const [streetCatalog, setStreetCatalog] = useState([]);
    const gridRef = useState(null);
    const columns = [
        {field: "id", headerName: "ID", width: 90},
        {
            field: "streetName",
            headerName: t("streetData.streetName"),
            flex: 0.5,
            editable: false
        },
        {
            field: "districtName",
            headerName: t("streetData.districtName"),
            flex: 0.5,
            editable: false
        }
    ];

    useEffect(() => {
        if (gridRef.current) {
            setGridHeight(gridRef.current.clientHeight);
        }
        if (showDataTable) {
            streetCatalogRest.findAllListByCity(city)
                .then(response => {
                    setStreetCatalog(response.data);
                })
                .catch((error) => {
                    //TODO
                });
        }
    }, [showDataTable, streetCatalog]);

    function handleTypes(event, newTypes) {
        if (newTypes.length) {
            setTypes(newTypes);
        }
    }

    function toggleDataTable() {
        setShowDataTable(!showDataTable);
    }

    function renderDataTable() {
        if (showDataTable) {
            return (
                <StreetTableLayout>
                    <DataGrid
                        ref={gridRef}
                        localeText={locale.components.MuiDataGrid.defaultProps.localeText}
                        rows={streetCatalog}
                        columns={columns}
                        resizeable={true}
                        //onRowClick={handleStreetRowClick}
                        showToolbar
                        density="compact"
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5
                                }
                            },
                            sorting: {
                                sortModel: [{field: "name", sort: "asc"}]
                            }
                        }}
                        pageSizeOptions={[10]}
                        disableRowSelectionOnClick
                    />
                </StreetTableLayout>
            );
        } else {
            return null;
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
                    prefix='wastedata'
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
                    onSelectedDistrictChange={setShowDistricts}
                />
            </FilterLayout>

            <DetectionMapMenu
                types={types}
                handleTypes={handleTypes}
                setViewState={setViewState}
                showDataTable={toggleDataTable}
            />

            <DetectionMap
                viewState={viewState}
                onViewStateChange={({viewState}) => setViewState(viewState)}
                detectionData={detectionData}
                vehicleRoutes={vehicleRoutes}
                features={selectedFeatures}
                districts={districts}
                positionData={vehicleData}
                showPosition={selectedFilterLabels.includes("selection.currentPosition")}
                showHeatmap={types.includes("heatmap")}
                showHexagons={types.includes("hexagon")}
                showScatterplot={types.includes("scatterplot")}
                showCoverage={types.includes("coverage")}
                showDistricts={showDistricts}
            />
            {renderDataTable()}
        </>
    );
}

export default DetectionOverview;