import CrudRest from "./CrudRest";
import axios from "axios";

class VehicleRoutesRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/vehicleroute");
    }

    findAllByVehicle(name) {
        return axios.get(this.baseUrl + "/vehicle/" + name);
    }

    findAllByVehicleAndTimeframe(name, start, end) {
        return axios.get(this.baseUrl + "/timeframe/" + name + '/' + start + "/" + end);
    }

    findAllByVehicleAndWeek(name, year, week) {
        return axios.get(this.baseUrl + "/calendarweek/" + name + '/' + year + "/" + week);
    }

    findAvailableTimeFrames() {
        return axios.get(this.baseUrl + "/timeframes");
    }
}

export default VehicleRoutesRest;
