import CrudRest from "./CrudRest";
import axios from "axios";

class ConfigurationRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/configuration");
    }

    getMapCenter() {
        return axios.get(this.baseUrl + "/mapcenter");
    }

}

export default ConfigurationRest;