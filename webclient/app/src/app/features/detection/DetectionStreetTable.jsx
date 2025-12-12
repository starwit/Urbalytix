import {DataGrid} from "@mui/x-data-grid";
import {deDE, enUS} from '@mui/x-data-grid/locales';
import {useContext, useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {FilterContext} from "../../commons/FilterProvider";
import DetectionCountRest from "../../services/DetectionCountRest";
import DataTableLayout from "../../commons/DataTableLayout";
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {Breadcrumbs, IconButton, Link, Stack, Tooltip, Typography} from "@mui/material";

function DetectionDistrictTable(props) {
    const {showDataTable, handleBackClick = () => { }, city, districtId, districtName} = props;
    const {t, i18n} = useTranslation();
    const locale = i18n.language == "de" ? deDE : enUS;

    const {startDate, endDate} = useContext(FilterContext);
    const detectionCountRest = useMemo(() => new DetectionCountRest(), []);
    const [streetCatalog, setStreetCatalog] = useState([]);

    const columns = [
        {
            field: "streetName",
            headerName: t("streetData.streetName"),
            flex: 0.5
        },
        {
            field: "totalCount",
            headerName: t("detectiondata.sum"),
            flex: 0.5
        }
    ];

    useEffect(() => {
        if (showDataTable) {
            detectionCountRest.findAsStreetByDistrictAndTimeFrame(startDate.toJSON(), endDate.toJSON(), districtId).then(response => {
                if (response.data == null) {
                    return;
                }
                setStreetCatalog(response.data);
            })
        }
    }, [showDataTable, startDate]);

    function handleClick() {
        handleBackClick(true);
    }

    return (
        <DataTableLayout>
            <Stack direction="row" alignItems="center">
                <IconButton>
                    <ArrowBackIcon onClick={handleClick} />
                </IconButton>
                <Breadcrumbs aria-label="breadcrumb">
                    <Typography color="text.primary" >{city}</Typography>
                    <Typography color="text.primary">{districtName}</Typography>
                </Breadcrumbs>
            </Stack>
            <DataGrid
                localeText={locale.components.MuiDataGrid.defaultProps.localeText}
                rows={streetCatalog}
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

export default DetectionDistrictTable;