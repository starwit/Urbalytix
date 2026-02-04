import CrudRest from "./CrudRest";
import axios from "axios";

class ConfigurationRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/configuration");
    }

    getAllConfigurations() {
        return axios.get(this.baseUrl + "/");
    }

    setConfiguration(configs) {
        return axios.post(this.baseUrl + "/", configs);
    }

    setConfigurationByKey(config) {
        return axios.post(this.baseUrl + "/setbykey", config);
    }

    getMapCenter() {
        return axios.get(this.baseUrl + "/mapcenter");
    }

}

export default ConfigurationRest;