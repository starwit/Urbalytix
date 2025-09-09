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
        let isMounted = true;
        const loadVehicleData = () => {
            vehicleDataRest.findAllFormatted().then(response => {
                if (isMounted && response.data != null) {
                    setVehicleData(response.data);
                }
            });
        };
        loadVehicleData();
        const interval = setInterval(loadVehicleData, intervalMs);
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [vehicleDataRest, intervalMs]);

    return vehicleData;
}
