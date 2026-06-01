import CrudRest from "./CrudRest";
import axios from "axios";

class VehicleRoutesRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/vehicleroute");
    }

    findAllByVehicle(name) {
        return axios.get(this.baseUrl + "/vehicle/" + name);
    }

    findAggregatedByVehicleAndTimeframe(name, start, end) {
        return axios.get(this.baseUrl + "/timeframe/aggregated/" + name + '/' + start + "/" + end);
    }

    findAggregatedByVehicleAndWeek(name, year, week) {
        return axios.get(this.baseUrl + "/calendarweek/aggregated/" + name + '/' + year + "/" + week);
    }

    findAvailableTimeFrames() {
        return axios.get(this.baseUrl + "/timeframes");
    }
}

export default VehicleRoutesRest;
