import {DataGrid} from "@mui/x-data-grid";
import StreetTableLayout from "../adminarea/streetcatalog/StreetTableLayout";

function WasteDataTable(props) {
    const {showDataTable, districtCatalog, handleStreetRowClick} = props;
    const {t, i18n} = useTranslation();
    const locale = i18n.language == "de" ? deDE : enUS;

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