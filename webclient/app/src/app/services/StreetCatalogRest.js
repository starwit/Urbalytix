import CrudRest from "./CrudRest";
import axios from "axios";

class StreetCatalogRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/street-catalog");
    }

    findById(id) {
        return axios.get(this.baseUrl + "/" + id);
    }

    findAllGeometryByCity(city) {
        return axios.get(this.baseUrl + "/geometrybycity/" + city);
    }

    findAllListByCity(city) {
        return axios.get(this.baseUrl + "/list/" + city);
    }

    findAllListByCityAndDistrict(city, district) {
        return axios.get(this.baseUrl + "/list/district/" + city + "/" + district);
    }

    findAllWithLastCleaning(city) {
        return axios.get(this.baseUrl + "/cleaning/" + city);
    }
}

export default StreetCatalogRest;
