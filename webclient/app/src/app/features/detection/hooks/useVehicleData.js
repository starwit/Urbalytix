import {useState, useEffect, useMemo} from "react";
import VehicleDataRest from "../../../services/VehicleDataRest";

/**
 * Custom hook to fetch vehicle data periodically.
 * @param {number} intervalMs - Polling interval in milliseconds (default: 2000)
 * @returns {Array} vehicleData
 */
export function useVehicleData(intervalMs = 2000) {
    const [vehicleData, setVehicleData] = useState([]);
    const vehicleDataRest = useMemo(() => new VehicleDataRest(), []);

    useEffect(() => {
        loadVehicleData();
        const interval = setInterval(loadVehicleData, intervalMs);
        return () => clearInterval(interval);
    }, [vehicleDataRest, intervalMs]);

    function loadVehicleData() {
        vehicleDataRest.findAllFormatted().then(response => {
            if (response.data != null) {
                setVehicleData(response.data);
            }
        });
    }

    return vehicleData;
}
