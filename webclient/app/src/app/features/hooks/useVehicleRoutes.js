import {useContext, useEffect, useMemo, useState} from "react";
import {FilterContext} from "../../commons/FilterProvider";
import VehicleDataRest from "../../services/VehicleDataRest";
import VehicleRoutesRest from "../../services/VehicleRoutesRest";

/**
 * Custom React hook to fetch vehicle routes based on the current filter context.
 * @returns {Array} Array of vehicle route objects.
 */
export function useVehicleRoutes() {
    const {startDate, endDate} = useContext(FilterContext);
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

        const routeResponses = await Promise.all(vehicleStreamKeys.map(name => vehicleRoutesRest.findAggregatedByVehicleAndTimeframe(name, startDate.toJSON(), endDate.toJSON())));
        const allRoutes = routeResponses.flatMap(r => r.data.flatMap(d => d.sectionPoints).filter(d => d.prevLatitude !== null));
        setVehicleRoutes(allRoutes);

    }

    return vehicleRoutes;
}
