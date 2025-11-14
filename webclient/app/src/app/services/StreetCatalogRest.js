import CrudRest from "./CrudRest";
import axios from "axios";

class StreetCatalogRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/street-catalog");
    }

    findById(id) {
        return axios.get(this.baseUrl + "/" + id);
    }

    findAllByCity(city) {
        return axios.get(this.baseUrl + "/city/" + city);
    }

    findAllByCityNamesOnly(city) {
        return axios.get(this.baseUrl + "/catalog/" + city);
    }
}

export default StreetCatalogRest;
