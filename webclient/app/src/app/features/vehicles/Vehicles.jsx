import {useEffect, useState, useMemo} from "react";
import {Paper, Typography} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {useTranslation} from "react-i18next";
import {deDE, enUS} from '@mui/x-data-grid/locales';

import VehicleDataRest from '../../services/VehicleDataRest';

function Vehicles() {
    const {t, i18n} = useTranslation();
    const locale = i18n.language == "de" ? deDE : enUS
    const vehicleDataRest = useMemo(() => new VehicleDataRest(), []);
    const [vehicleData, setVehicleData] = useState([]);

    const columns = [
        {field: "id", headerName: "ID", width: 90},
        {
            field: "name",
            headerName: t("vehicledata.name"),
            flex: 0.5,
            editable: false
        },
        {
            field: "streamKey",
            headerName: t("vehicledata.streamkey"),
            flex: 0.4,
            editable: false
        },
        {
            field: "description",
            headerName: t("vehicledata.description"),
            flex: 0.7,
            editable: false,
        },
        {
            field: "latitude",
            headerName: t("vehicledata.latitude"),
            flex: 0.4,
            editable: false
        },
        {
            field: "longitude",
            headerName: t("vehicledata.longitude"),
            flex: 0.4,
            editable: false
        },
        {
            field: "lastUpdate",
            headerName: t("vehicledata.lastupdate"),
            flex: 0.5,
            editable: false
        }
    ];

    useEffect(() => {
        loadVehicleData();
    }, []);

    function loadVehicleData() {
        vehicleDataRest.findAll().then(response => {
            if (response.data == null) {
                return;
            }
            setVehicleData(response.data);
        });
    }

    return (
        <>
            <Typography variant="h2" gutterBottom sx={{flex: 1}}>
                {t("vehicledata.heading")}
            </Typography>
            <Paper sx={{padding: 2}}>
                <DataGrid
                    localeText={locale.components.MuiDataGrid.defaultProps.localeText}
                    rows={vehicleData}
                    columns={columns}
                    resizeable={true}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10
                            }
                        },
                        sorting: {
                            sortModel: [{field: "id", sort: "asc"}]
                        }
                    }}
                    pageSizeOptions={[10]}
                    disableRowSelectionOnClick
                />
            </Paper>
        </>
    );
}

export default Vehicles