import {useState, useEffect, useMemo, useContext} from "react";
import ConfigurationRest from "../../services/ConfigurationRest";
import DetectionCountRest from "../../services/DetectionCountRest";
import {DataGrid} from "@mui/x-data-grid";
import StreetTableLayout from "../adminarea/streetcatalog/StreetTableLayout";
import {useTranslation} from "react-i18next";
import {deDE, enUS} from '@mui/x-data-grid/locales';
import {FilterContext} from "../../commons/FilterProvider";

function WasteDataTable(props) {
    const {showDataTable, handleStreetRowClick, setGridHeight, city} = props;
    const {t, i18n} = useTranslation();
    const locale = i18n.language == "de" ? deDE : enUS;

    const {startDate, endDate} = useContext(FilterContext);
    const detectionCountRest = useMemo(() => new DetectionCountRest(), []);
    const gridRef = useState(null);
    const [districtCatalog, setDistrictCatalog] = useState([]);

    const columns = [
        {field: "id", headerName: "ID", width: 90},
        {
            field: "districtName",
            headerName: t("district.name"),
            flex: 0.5,
            editable: false
        },
        {
            field: "totalCount",
            headerName: t("wastedata.heading"),
            flex: 0.5,
            editable: false
        }
    ];

    useEffect(() => {
        if (gridRef.current) {
            setGridHeight(gridRef.current.clientHeight);
        }
        if (showDataTable) {
            detectionCountRest.findByDistrictAndTimeFrame(startDate.toJSON(), endDate.toJSON()).then(response => {
                if (response.data == null) {
                    return;
                }
                var data = response.data;
                // add an ID column
                var i = 1;
                data.forEach(d => {
                    d.id = i++;
                });
                setDistrictCatalog(data);
            })
        }
    }, [showDataTable, startDate]);

    if (showDataTable) {
        return (
            <StreetTableLayout>
                <DataGrid
                    ref={gridRef}
                    localeText={locale.components.MuiDataGrid.defaultProps.localeText}
                    rows={districtCatalog}
                    columns={columns}
                    resizeable={true}
                    onRowClick={handleStreetRowClick}
                    showToolbar
                    density="compact"
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 8
                            }
                        },
                        sorting: {
                            sortModel: [{field: "name", sort: "asc"}]
                        }
                    }}
                    pageSizeOptions={[10]}
                    disableRowSelectionOnClick
                />
            </StreetTableLayout>
        );
    } else {
        return null;
    }
}

export default WasteDataTable;