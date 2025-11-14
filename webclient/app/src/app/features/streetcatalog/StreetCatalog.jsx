import {useEffect, useState, useMemo} from "react";
import {Paper, Tooltip, Typography} from "@mui/material";
import StreetCatalogRest from "../../services/StreetCatalogRest";
import {useTranslation} from "react-i18next";
import {deDE, enUS} from '@mui/x-data-grid/locales';
import {DataGrid} from "@mui/x-data-grid";


function StreetCatalog() {
    const {t, i18n} = useTranslation();
    const locale = i18n.language == "de" ? deDE : enUS;
    const streetCatalogRest = useMemo(() => new StreetCatalogRest(), []);
    const [streetData, setStreetData] = useState([]);

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
        loadStreetData();
    }, []);

    function loadStreetData() {
        streetCatalogRest.findAllByCityNamesOnly("Wolfsburg").then(response => {
            if (response.data == null) {
                return;
            }
            setStreetData(response.data);
        });
    }

    return (
        <div>
            <Typography variant="h2" gutterBottom sx={{flex: 1}}>
                {t("streetData.heading")}
            </Typography>
            <Paper sx={{padding: 2}}>
                <DataGrid
                    localeText={locale.components.MuiDataGrid.defaultProps.localeText}
                    rows={streetData}
                    columns={columns}
                    resizeable={true}
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
            </Paper>
        </div>
    );
}

export default StreetCatalog;