import CrudRest from "./CrudRest";
import axios from "axios";

class DetectionCountRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/detection-count");
    }

    findAllLimited(amount) {
        return axios.get(this.baseUrl + "/limited/" + amount);
    }

    findByTimeFrame(start, end) {
        return axios.get(this.baseUrl + "/timeframe/" + start + "/" + end);
    }

    findByDistrictAndTimeFrame(start, end) {
        return axios.get(this.baseUrl + "/district/" + start + "/" + end);
    }

    getObjectClasses(start, end) {
        return axios.get(this.baseUrl + "/classes/" + start + "/" + end);
    }
}

export default DetectionCountRest;
