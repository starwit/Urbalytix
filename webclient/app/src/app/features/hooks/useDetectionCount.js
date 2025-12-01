import {useContext, useEffect, useMemo, useState} from "react";
import {FilterContext} from "../../commons/FilterProvider";
import DetectionCountRest from "../../services/DetectionCountRest";

/**
 * Custom hook to fetch detection data with a limit.
 * @param {number} initialCount - Initial detection count limit.
 * @returns {[Array, number, Function]} [detectionData, detectionCount, setDetectionCount]
 */
export function useDetectionCount() {
    const {startDate, endDate, selectedObjectClasses} = useContext(FilterContext);
    const [rawDetectionData, setDetectionData] = useState([]);
    const detectionCountRest = useMemo(() => new DetectionCountRest(), []);

    useEffect(() => {
        detectionCountRest.findByTimeFrame(startDate.toJSON(), endDate.toJSON()).then(response => {
            if (response.data != null) {
                setDetectionData(response.data);
            }
        });
    }, [startDate, endDate]);

    var detectionData = rawDetectionData.filter(d => {
        if (selectedObjectClasses.includes(d.className)) {
            return true;
        }
        return false;
    });

    return {
        detectionData
    };
}
