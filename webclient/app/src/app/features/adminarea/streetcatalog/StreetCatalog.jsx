import {useEffect, useState, useMemo, useRef, useContext} from "react";
import StreetCatalogRest from "../../../services/StreetCatalogRest";
import ConfigurationRest from "../../../services/ConfigurationRest";
import {useTranslation} from "react-i18next";
import {deDE, enUS} from '@mui/x-data-grid/locales';
import {DataGrid} from "@mui/x-data-grid";
import DeckGL from "@deck.gl/react";
import {MapView} from "@deck.gl/core";
import {MapLayerFactory} from "../../../commons/geographicalMaps/MapLayerFactory";
import {centroid} from '@turf/turf';
import {WebMercatorViewport} from "@deck.gl/core";
import {useDistricts} from "../../hooks/useCityDistricts";
import DataTableLayout from "../../../commons/DataTableLayout";
import {FilterContext} from '../../../commons/FilterProvider';
import MapMenuLayout from "../../../commons/mapMenu/MapMenuLayout";
import NavigationMapMenu from "../../../commons/mapMenu/NavigationMapMenu";


function StreetCatalog() {
    const {t, i18n} = useTranslation();
    const locale = i18n.language == "de" ? deDE : enUS;
    const streetCatalogRest = useMemo(() => new StreetCatalogRest(), []);
    const configurationRest = useMemo(() => new ConfigurationRest(), []);

    const [city, setCity] = useState('Wolfsburg');
    const {showDistricts, setShowDistricts, types, setTypes} = useContext(FilterContext);
    const {districts} = useDistricts({showDistricts: true});

    const [streetData, setStreetData] = useState([]);
    const [selectedStreet, setSelectedStreet] = useState([]);
    const [selectedDistrictStreets, setSelectedDistrictStreets] = useState([]);

    const is3d = types.includes("3d");
    const [viewState, setViewState] = useState({
        longitude: 10.779998775029739,
        latitude: 52.41988232741599,
        zoom: 10,
        pitch: is3d ? 60 : 0,
        bearing: 0
    });
    const gridRef = useState(null);
    const [gridHeight, setGridHeight] = useState(0);

    const columns = [
        {field: "id", headerName: "ID", width: 90},
        {
            field: "streetName",
            headerName: t("streetData.streetName"),
            flex: 0.3,
            editable: false
        },
        {
            field: "districtName",
            headerName: t("streetData.districtName"),
            flex: 0.3,
            editable: false
        },
        {
            field: "lastCleaning",
            headerName: t("streetData.lastCleaning"),
            flex: 0.3,
            editable: false
        }
    ];

    useEffect(() => {
        loadMapCenter();
        streetCatalogRest.findById(1).then(response => {
            setSelectedStreet(response.data);
        });
        if (gridRef.current) {
            setGridHeight(gridRef.current.clientHeight);
        }
    }, []);

    function loadMapCenter() {
        configurationRest.getMapCenter().then(response => {
            setViewState({
                longitude: response.data.geometry.coordinates[0],
                latitude: response.data.geometry.coordinates[1],
                zoom: 12,
                pitch: 0,
                bearing: 0
            });
            loadStreetData(response.data.properties['city']);
            setCity(response.data.properties['city']);
        });
    }

    function loadStreetData(city) {
        streetCatalogRest.findAllWithLastCleaning(city).then(response => {
            if (response.data == null) {
                return;
            }
            setStreetData(response.data);
        });
    }

    const MAP_VIEW = new MapView({repeat: true});

    const layers = [
        MapLayerFactory.createBaseMapLayer(),
        MapLayerFactory.createGeoJsonLayer(selectedStreet, 'singleStreet'),
        MapLayerFactory.createDistrictLayer(districts, showDistricts, true, handleDistrictDetailsClick),
        MapLayerFactory.createGeoJsonLayer(selectedDistrictStreets, 'districtStreets')
    ];

    function handleStreetRowClick(params) {
        streetCatalogRest.findById(params.row.id).then(response => {
            setSelectedStreet(response.data);
            const lon = centroid(response.data).geometry.coordinates[0];
            const lat = centroid(response.data).geometry.coordinates[1];

            const width = window.innerWidth;
            const height = window.innerHeight;

            const vp = new WebMercatorViewport({
                longitude: viewState.longitude,
                latitude: viewState.latitude,
                zoom: viewState.zoom,
                width: width,
                height: height
            });

            const [xPx, yPx] = vp.project([lon, lat]);
            const paddingPx = 15; // tweak as needed
            const offsetY = gridHeight / 2 + paddingPx;
            const newScreen = [xPx, yPx + offsetY];
            const [newLon, newLat] = vp.unproject(newScreen);

            setViewState(prev => ({
                longitude: lon,
                latitude: newLat,
                zoom: 12,
                pitch: 0,
                bearing: 0
            }));
        })
    }

    function handleDistrictDetailsClick(data) {
        streetCatalogRest.findAllListByCityAndDistrict(city, data.districtName).then(response => {
            if (response.data == null) {
                return;
            }
            setSelectedDistrictStreets(response.data);
        });
    }

    function handleShowDistricts(newValue) {
        setSelectedDistrictStreets([]);
        setShowDistricts(newValue);
    }

    function handleTypes(event, newTypes) {
        if (newTypes.length) {
            setTypes(newTypes);
        }
    }

    return (
        <>
            <MapMenuLayout
                value={types}
                onChange={handleTypes}
            >
                <NavigationMapMenu setViewState={setViewState} setShowDistricts={handleShowDistricts} />
            </MapMenuLayout>

            <DeckGL
                layers={layers}
                views={MAP_VIEW}
                initialViewState={viewState}
                controller={{dragRotate: false}}
            >
            </DeckGL>

            <DataTableLayout>
                <DataGrid
                    ref={gridRef}
                    localeText={locale.components.MuiDataGrid.defaultProps.localeText}
                    rows={streetData}
                    columns={columns}
                    resizeable={true}
                    onRowClick={handleStreetRowClick}
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
                    pageSizeOptions={[5, 10]}
                    disableRowSelectionOnClick
                />
            </DataTableLayout>
        </ >
    );
}

export default StreetCatalog;