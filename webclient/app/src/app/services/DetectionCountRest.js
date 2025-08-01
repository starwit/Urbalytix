import CrudRest from "./CrudRest";

class DetectionCountRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/detection-count");
    }
}
export default DetectionCountRest;
