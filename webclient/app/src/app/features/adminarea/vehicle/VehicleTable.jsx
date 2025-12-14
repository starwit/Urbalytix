import {useEffect, useState, useMemo, useContext} from "react";
import {Checkbox, Stack, Tooltip, Typography} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {useTranslation} from "react-i18next";
import {deDE, enUS} from '@mui/x-data-grid/locales';
import VehicleIcon from '@mui/icons-material/LocalShipping';
import VehicleDataRest from '../../../services/VehicleDataRest';
import {FilterContext} from "../../../commons/FilterProvider";
import dayjs from 'dayjs';

function VehicleTable(props) {
    const {showDataTable, selectedVehicleData, onSelectedVehicleDataChange} = props;
    const {t, i18n} = useTranslation();
    const locale = i18n.language == "de" ? deDE : enUS
    const [rowSelectionModel, setRowSelectionModel] = useState({
        type: 'include',
        ids: new Set()
    });
    const vehicleDataRest = useMemo(() => new VehicleDataRest(), []);
    const [vehicleData, setVehicleData] = useState([]);
    const {startDate, endDate} = useContext(FilterContext);

    const columns = [
        {
            field: "actions",
            type: "actions",
            headerName: t("vehicledata.showRoutes"),
            sortable: false,
            width: 110,
            renderCell: params => <MyRenderCheckBox isSelected={params.row.isSelected} vehicleId={params.row.id} row={params.row} />
        },
        {
            field: "name",
            headerName: t("vehicledata.name"),
            flex: 0.15,
            editable: false
        },
        {
            field: "description",
            headerName: t("vehicledata.description"),
            flex: 0.35,
            editable: false,
        },
        {
            field: "location",
            headerName: t("vehicledata.location"),
            flex: 0.35,
            editable: false
        },
        {
            field: "lastUpdate",
            headerName: t("vehicledata.lastupdate"),
            flex: 0.2,
            editable: false
        },
        {
            field: "distances",
            headerName: t("vehicledata.distance"),
            editable: false,
            flex: 0.5,
            renderCell: vehicle => {
                return (
                    <Stack direction="row" spacing={1}>
                        {Object.entries(vehicle.row.distances).map(([day, value]) => (
                            <>
                                {dayjs(day).format('MM-DD')}:
                                {value}
                            </>
                        ))}
                    </Stack>
                );
            }
        },
        {
            field: "status",
            headerName: t("vehicledata.status"),
            flex: 0.08,
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
    }, [startDate, endDate]);

    function loadVehicleData() {
        vehicleDataRest.findAllWithStatistics(startDate.toJSON(), endDate.toJSON()).then(response => {
            console.log(response.data);
            if (response.data == null) {
                return;
            }

            response.data.forEach(vehicle => {
                vehicle["isSelected"] = false;
            });
            setVehicleData(response.data);
        });
    }

    if (showDataTable) {
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
}

export default VehicleTable;