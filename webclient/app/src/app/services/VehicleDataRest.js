import CrudRest from "./CrudRest";
import axios from "axios";

class VehicleDataRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/vehicle");
    }

    findAllFormatted = async () => {
        const response = await this.findAll();
        if (response.data == null) {
            return response;
        }
        for (const vehicle of response.data) {
            vehicle.lastUpdate = new Date(vehicle.lastUpdate).toLocaleString();
            const now = new Date();
            const diffInSeconds = ((now - new Date(vehicle.lastUpdate)) / 1000);
            vehicle.status = diffInSeconds <= 30 ? "online" : "offline";
        }
        return response;
    }

    findAllWithStatistics = async (startTime, endTime) => {
        const response = await axios.get(this.baseUrl + "/statistics/" + startTime + "/" + endTime);
        if (response.data == null) {
            return [];
        }
        for (const vehicle of response.data) {
            vehicle.lastUpdate = new Date(vehicle.lastUpdate).toLocaleString();
            const now = new Date();
            const diffInSeconds = ((now - new Date(vehicle.lastUpdate)) / 1000);
            vehicle.status = diffInSeconds <= 30 ? "online" : "offline";
        }

        return response;
    }
}

export default VehicleDataRest;