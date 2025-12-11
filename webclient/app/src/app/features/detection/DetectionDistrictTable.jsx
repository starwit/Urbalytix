import {DataGrid} from "@mui/x-data-grid";
import {deDE, enUS} from '@mui/x-data-grid/locales';
import {useContext, useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {FilterContext} from "../../commons/FilterProvider";
import DetectionCountRest from "../../services/DetectionCountRest";
import DataTableLayout from "../../commons/DataTableLayout";
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import {IconButton, Tooltip} from "@mui/material";

function DetectionTable(props) {
    const {showDataTable, handleDistrictDetailsClick = () => { }, city} = props;
    const {t, i18n} = useTranslation();
    const locale = i18n.language == "de" ? deDE : enUS;

    const {startDate, endDate} = useContext(FilterContext);
    const detectionCountRest = useMemo(() => new DetectionCountRest(), []);
    const [districtCatalog, setDistrictCatalog] = useState([]);

    const columns = [
        {
            field: "districtName",
            headerName: t("district.name"),
            flex: 0.5
        },
        {
            field: "totalCount",
            headerName: t("detectiondata.sum"),
            flex: 0.45
        },
        {
            field: "actionButton",
            headerName: "",
            flex: 0.05,
            align: "center",
            disableExport: true,
            disableClickEventBubbling: true,
            renderCell: cellValues => {
                return (
                    <Tooltip title={t('district.showdetails')}>
                        <IconButton
                            variant="contained"
                            color="primary"
                            size="small"
                            style={{marginLeft: 16}}
                            onClick={event => {
                                handleDistrictDetailsClick(cellValues.row);
                            }}
                        >
                            <ManageSearchIcon />

                        </IconButton>
                    </Tooltip>
                );
            }
        }
    ];

    useEffect(() => {
        if (showDataTable) {
            detectionCountRest.findByDistrictAndTimeFrame(startDate.toJSON(), endDate.toJSON()).then(response => {
                if (response.data == null) {
                    return;
                }
                setDistrictCatalog(response.data);
            })
        }
    }, [showDataTable, startDate]);


    return (
        <DataTableLayout>
            <DataGrid
                localeText={locale.components.MuiDataGrid.defaultProps.localeText}
                rows={districtCatalog}
                columns={columns}
                resizeable={true}
                editable={false}
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
    );
}

export default DetectionTable;