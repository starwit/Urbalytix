import {useEffect, useMemo, useState} from "react";
import CityDistrictRest from '../../../services/CityDistrictRest';

export function useDistricts(props) {
    const [districts, setDistricts] = useState([]);
    const {showDistricts} = props;
    const cityDistrictRest = useMemo(() => new CityDistrictRest(), []);

    useEffect(() => {
        if (showDistricts) {
            reloadDistricts();
        }
    }, [showDistricts]);

    function reloadDistricts() {
        cityDistrictRest.findAllByCityAsGeometry('Wolfsburg').then(response => handleLoadDistricts(response));
    }

    function handleLoadDistricts(response) {
        if (response.data == null) {
            return;
        }
        setDistricts(response.data);
    }

    return {
        districts
    };
}
