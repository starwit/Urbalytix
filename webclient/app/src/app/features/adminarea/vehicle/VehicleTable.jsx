import {useEffect, useState, useMemo} from "react";
import {Checkbox, Tooltip} from "@mui/material";
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import {useTranslation} from "react-i18next";
import {deDE, enUS} from '@mui/x-data-grid/locales';
import VehicleIcon from '@mui/icons-material/LocalShipping';

import VehicleDataRest from '../../../services/VehicleDataRest';

function VehicleTable(props) {
    const {selectedVehicleData, onSelectedVehicleDataChange} = props;
    const {t, i18n} = useTranslation();
    const locale = i18n.language == "de" ? deDE : enUS
    const [rowSelectionModel, setRowSelectionModel] = useState({
        type: 'include',
        ids: new Set()
    });
    const vehicleDataRest = useMemo(() => new VehicleDataRest(), []);
    const [vehicleData, setVehicleData] = useState([]);

    const columns = [
        {
            field: "actions2",
            type: "actions",
            headerName: t("vehicledata.showRoutes"),
            sortable: false,
            width: 160,
            renderCell: params => <MyRenderCheckBox isSelected={params.row.isSelected} vehicleId={params.row.id} row={params.row} />
        },
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
        },
        {
            field: "status",
            headerName: t("vehicledata.status"),
            flex: 0.4,
            editable: false,
            renderCell: vehicle => {
                return (
                    <Tooltip title={t(`vehicle.status.${vehicle.row.status}`)}>
                        <VehicleIcon color={vehicle.row.status == "online" ? "success" : "error"} />
                    </Tooltip >
                );
            }
        }
    ];

    function MyRenderCheckBox(props) {
        const [checked, setChecked] = useState(props.isSelected);

        function handleChange(e) {
            setChecked(e.target.checked);

            const tmpVehicleData = vehicleData;
            tmpVehicleData.forEach(vehicle => {
                if (vehicle.id === props.vehicleId) {
                    vehicle.isSelected = e.target.checked;
                }
            });
            setVehicleData(tmpVehicleData);
            var streamKey = props.row.streamKey;
            if (selectedVehicleData.includes(streamKey)) {
                onSelectedVehicleDataChange(selectedVehicleData.filter(s => s !== streamKey));
            } else {
                onSelectedVehicleDataChange([...selectedVehicleData, streamKey]);
            }
        }

        return <Checkbox
            checked={checked}
            onChange={handleChange}
        />;
    }

    useEffect(() => {
        loadVehicleData();
        //const interval = setInterval(loadVehicleData, 2000);
        //return () => clearInterval(interval);
    }, []);

    function loadVehicleData() {
        vehicleDataRest.findAllFormatted().then(response => {
            if (response.data == null) {
                return;
            }

            response.data.forEach(vehicle => {
                vehicle["isSelected"] = false;
            });
            setVehicleData(response.data);
        });
    }

    return (
        <>
            <DataGrid
                localeText={locale.components.MuiDataGrid.defaultProps.localeText}
                rows={vehicleData}
                columns={columns}
                resizeable={true}
                editable={false}
                showToolbar
                density="compact"
                rowSelectionModel={rowSelectionModel}
                onRowSelectionModelChange={(newModel) => setRowSelectionModel(newModel)}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10
                        }
                    },
                    sorting: {
                        sortModel: [{field: "name", sort: "asc"}]
                    }
                }}
                pageSizeOptions={[10]}
                disableRowSelectionOnClick
            />
        </>
    );
}

export default VehicleTable;