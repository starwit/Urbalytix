import {useEffect, useState, useMemo} from "react";
import {Box, Paper, Stack, Tooltip, Typography} from "@mui/material";
import StreetCatalogRest from "../../services/StreetCatalogRest";
import {useTranslation} from "react-i18next";
import {deDE, enUS} from '@mui/x-data-grid/locales';
import {DataGrid} from "@mui/x-data-grid";
import DeckGL from "@deck.gl/react";
import {MapView} from "@deck.gl/core";
import {MapLayerFactory} from "../../commons/geographicalMaps/MapLayerFactory";
import {centroid} from '@turf/turf';

function StreetCatalog() {
    const {t, i18n} = useTranslation();
    const locale = i18n.language == "de" ? deDE : enUS;
    const streetCatalogRest = useMemo(() => new StreetCatalogRest(), []);
    const [streetData, setStreetData] = useState([]);
    const [selectedStreet, setSelectedStreet] = useState([]);
    const [viewState, setViewState] = useState();

    const columns = [
        {field: "id", headerName: "ID", width: 90},
        {
            field: "streetName",
            headerName: t("streetData.streetName"),
            flex: 0.5,
            editable: false
        }
    ];

    useEffect(() => {
        setViewState({
            longitude: 10.779998775029739,
            latitude: 52.41988232741599,
            zoom: 12,
            pitch: 0,
            bearing: 0
        });
        loadStreetData();
        streetCatalogRest.findById(1).then(response => {
            setSelectedStreet(response.data);
            console.log(response.data);
        })
    }, []);

    function loadStreetData() {
        streetCatalogRest.findAllByCityNamesOnly("Wolfsburg").then(response => {
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

    function handleRowClick(params) {
        streetCatalogRest.findById(params.row.id).then(response => {
            setSelectedStreet(response.data);
            setViewState({
                longitude: centroid(response.data).geometry.coordinates[0],
                latitude: centroid(response.data).geometry.coordinates[1],
                zoom: 12,
                pitch: 0,
                bearing: 0
            });
        })
    }

    return (
        <div>
            <Typography variant="h2" gutterBottom sx={{flex: 1}}>
                {t("streetData.heading")}
            </Typography>
            <Stack direction="column">
                <Stack >
                    <Box sx={{aspectRatio: "inherit", position: 'relative'}}>
                        <Box sx={{aspectRatio: "16/2", objectFit: "contain"}}>
                            <DeckGL
                                layers={layers}
                                views={MAP_VIEW}
                                initialViewState={viewState}
                                controller={{dragRotate: false}}
                            >
                            </DeckGL >
                        </Box>
                    </Box>
                </Stack>
                <Stack >
                    <DataGrid
                        localeText={locale.components.MuiDataGrid.defaultProps.localeText}
                        rows={streetData}
                        columns={columns}
                        resizeable={true}
                        onRowClick={handleRowClick}
                        showToolbar
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 20
                                }
                            },
                            sorting: {
                                sortModel: [{field: "name", sort: "asc"}]
                            }
                        }}
                        pageSizeOptions={[10]}
                        disableRowSelectionOnClick
                    />
                </Stack>
            </Stack>
        </div >
    );
}

export default StreetCatalog;