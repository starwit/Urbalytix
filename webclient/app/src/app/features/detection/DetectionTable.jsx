import {DataGrid} from "@mui/x-data-grid";
import {deDE, enUS} from '@mui/x-data-grid/locales';
import {useContext, useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {FilterContext} from "../../commons/FilterProvider";
import DetectionCountRest from "../../services/DetectionCountRest";
import StreetTableLayout from "../adminarea/streetcatalog/StreetTableLayout";

function DetectionTable(props) {
    const {showDataTable, handleStreetRowClick = () => { }, city} = props;
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
            headerName: t("detectiondata.heading"),
            flex: 0.5
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

    if (showDataTable) {
        return (
            <StreetTableLayout>
                <DataGrid
                    localeText={locale.components.MuiDataGrid.defaultProps.localeText}
                    rows={districtCatalog}
                    columns={columns}
                    resizeable={true}
                    editable={false}
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
            </StreetTableLayout>
        );
    } else {
        return null;
    }
}

export default DetectionTable;