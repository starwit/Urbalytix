import CrudRest from "./CrudRest";

class FeatureCollectorRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/feature-collector");
    }
}
export default FeatureCollectorRest;
