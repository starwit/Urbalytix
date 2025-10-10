import {useState, useEffect, useMemo} from "react";
import DetectionCountRest from "../../../services/DetectionCountRest";

/**
 * Custom hook to fetch detection data with a limit.
 * @param {number} initialCount - Initial detection count limit.
 * @returns {[Array, number, Function]} [detectionData, detectionCount, setDetectionCount]
 */
export function useDetectionCountDiff(startDate, endDate, selectedObjectClasses) {
    const [rawDetectionData, setDetectionData] = useState([]);
    const detectionCountRest = useMemo(() => new DetectionCountRest(), []);

    useEffect(() => {
        detectionCountRest.findByTimeFrame(startDate.toJSON(), endDate.toJSON()).then(response => {
            if (response.data != null) {
                setDetectionData(response.data);
            }
        });
    }, [detectionCountRest, startDate, endDate]);

    var detectioncomparisonData = rawDetectionData.filter(d => {
        if (selectedObjectClasses.includes(d.className)) {
            return true;
        }
        return false;
    });

    return {
        detectioncomparisonData
    };
}
