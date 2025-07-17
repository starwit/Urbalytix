import CrudRest from "./CrudRest";

class DecisionRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/detection-count");
    }
}
export default DecisionRest;
