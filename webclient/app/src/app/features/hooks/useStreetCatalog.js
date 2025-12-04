import {useEffect, useMemo, useState} from "react";
import StreetCatalogRest from "../../services/StreetCatalogRest";

export function useStreetCatalog(props) {
    const {showStreetData, city} = props;
    const [streetCatalog, setStreetCatalog] = useState([]);

    const streetCatalogRest = useMemo(() => new StreetCatalogRest(), []);

    useEffect(() => {
        if (showStreetData) {
            streetCatalogRest.findAllListByCity(city)
                .then(response => {
                    setStreetCatalog(response.data);
                })
                .catch((error) => {
                    //TODO
                });
        }
    }, [showStreetData]);

    return {streetCatalog};
}
