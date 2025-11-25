import CrudRest from "./CrudRest";
import axios from "axios";

class CityDistrictRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/city-district");
    }

    findAllByCity(city) {
        return axios.get(this.baseUrl + "/" + city);
    }

    findAllByCityAsGeometry(city) {
        return axios.get(this.baseUrl + "/city/" + city);
    }
}

export default CityDistrictRest;
