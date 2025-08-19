import CrudRest from "./CrudRest";
import axios from "axios";

class DetectionCountRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/detection-count");
    }

    findAllLimited(amount) {
        return axios.get(this.baseUrl + "/limited/" + amount);
    }

    getObjectClasses() {
        return axios.get(this.baseUrl + "/classes");
    }
}
export default DetectionCountRest;
