import {useEffect, useMemo, useState} from "react";
import CityDistrictRest from '../../../services/CityDistrictRest';

export function useDistricts() {
    const [districts, setDistricts] = useState([]);
    const cityDistrictRest = useMemo(() => new CityDistrictRest(), []);

    useEffect(() => {
        reloadDistricts();
    }, []);

    function reloadDistricts() {
        console.log("Loading city districts for Wolfsburg");
        cityDistrictRest.findAllByCityAsGeometry('Wolfsburg').then(response => handleLoadDistricts(response));
    }

    function handleLoadDistricts(response) {
        if (response.data == null) {
            return;
        }
        setDistricts(response.data);
    }

    return {
        districts,
        reloadDistricts: reloadDistricts
    };
}
