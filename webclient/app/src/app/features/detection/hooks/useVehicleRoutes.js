import {useEffect, useMemo, useState} from "react";
import VehicleDataRest from "../../../services/VehicleDataRest";
import VehicleRoutesRest from "../../../services/VehicleRoutesRest";

/**
 * Custom hook to fetch vehicle routes
 * @returns {Array} vehicleRoutes - Array of vehicle route objects
 */
export function useVehicleRoutes(startDate = null, endDate = null) {
    const [vehicleRoutes, setVehicleRoutes] = useState([]);
    const vehicleRoutesRest = useMemo(() => new VehicleRoutesRest(), []);
    const vehicleDataRest = useMemo(() => new VehicleDataRest(), []);

    useEffect(() => {
        if (startDate === null || endDate === null) {
            return;
        }
        loadVehicleRoutes();
    }, [startDate, endDate]);

    async function loadVehicleRoutes() {
        const vehicleResponse = await vehicleDataRest.findAll();
        if (vehicleResponse.data == null) {
            return;
        }

        const vehicleStreamKeys = vehicleResponse.data.map(v => v.streamKey);
        if (vehicleStreamKeys.length === 0) {
            return;
        }

        const routeResponses = await Promise.all(vehicleStreamKeys.map(name => vehicleRoutesRest.findAllByVehicleAndTimeframe(name, startDate, endDate)));
        const allRoutes = routeResponses.map(r => r.data).flat();
        setVehicleRoutes(allRoutes);

        
    }

    return vehicleRoutes;
}
