import {useEffect, useState, useMemo, useRef} from "react";
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
import FilterLayout from "../../../commons/filter/FilterLayout";
import {useDistricts} from "../../hooks/useCityDistricts";
import DistrictFilter from "../../../commons/filter/DistrictFilter";
import DataTableLayout from "../../../commons/DataTableLayout";

function StreetCatalog() {
    const {t, i18n} = useTranslation();
    const locale = i18n.language == "de" ? deDE : enUS;
    const streetCatalogRest = useMemo(() => new StreetCatalogRest(), []);
    const configurationRest = useMemo(() => new ConfigurationRest(), []);

    const [showDistricts, setShowDistricts] = useState(false);
    const {districts} = useDistricts({showDistricts: true});

    const [streetData, setStreetData] = useState([]);
    const [selectedStreet, setSelectedStreet] = useState([]);
    const [viewState, setViewState] = useState({
        longitude: 10.779998775029739,
        latitude: 52.41988232741599,
        zoom: 10,
        pitch: 0,
        bearing: 0
    });
    const gridRef = useState(null);
    const [gridHeight, setGridHeight] = useState(0);

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
        });
    }

    function loadStreetData(city) {
        streetCatalogRest.findAllListByCity(city).then(response => {
            if (response.data == null) {
                return;
            }
            setStreetData(response.data);
        });
    }

    const MAP_VIEW = new MapView({repeat: true});

    const layers = [
        MapLayerFactory.createBaseMapLayer(),
        MapLayerFactory.createGeoJsonLayer(selectedStreet)
    ];
    if (showDistricts) {
        layers.push(MapLayerFactory.createDistrictLayer(districts));
    }

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

    return (
        <>
            <FilterLayout leftPosition={10}>
                <DistrictFilter
                    onShowDistrictChange={setShowDistricts}
                />
            </FilterLayout>
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
                    pageSizeOptions={[10]}
                    disableRowSelectionOnClick
                />
            </DataTableLayout>
        </ >
    );
}

export default StreetCatalog;