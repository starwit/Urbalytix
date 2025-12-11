import {DataGrid} from "@mui/x-data-grid";
import {deDE, enUS} from '@mui/x-data-grid/locales';
import {useContext, useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {FilterContext} from "../../commons/FilterProvider";
import DetectionCountRest from "../../services/DetectionCountRest";
import DataTableLayout from "../../commons/DataTableLayout";
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import {Breadcrumbs, IconButton, Link, Tooltip} from "@mui/material";

function DetectionDistrictTable(props) {
    const {showDataTable, handleDistrictRowClick = () => { }, city, districtId} = props;
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
            headerName: t("detectiondata.heading"),
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

    function handleBackClick() {
        console.log("handleBackClick");
        handleDistrictRowClick(true);
    }

    return (
        <DataTableLayout>
            <Breadcrumbs>
                <Link underline="hover" color="inherit" onClick={handleBackClick}>Wolfsburg</Link>
                <Link underline="hover" color="inherit" >{districtId}</Link>
            </Breadcrumbs>
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