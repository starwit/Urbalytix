import CrudRest from "./CrudRest";
import axios from "axios";

class VehicleDataRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/vehicle");
    }
}

export default VehicleDataRest;