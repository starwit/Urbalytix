import {useState, useEffect, useMemo} from "react";
import DetectionCountRest from "../../../services/DetectionCountRest";

/**
 * Custom hook to fetch detection data with a limit.
 * @param {number} initialCount - Initial detection count limit.
 * @returns {[Array, number, Function]} [detectionData, detectionCount, setDetectionCount]
 */
export function useDetectionCount(initialCount = 1000) {
    const [detectionCount, setDetectionCount] = useState(initialCount);
    const [detectionData, setDetectionData] = useState([]);
    const detectionCountRest = useMemo(() => new DetectionCountRest(), []);

    useEffect(() => {
        detectionCountRest.findAllLimited(detectionCount).then(response => {
            if (response.data != null) {
                setDetectionData(response.data);
            }
        });
    }, [detectionCount, detectionCountRest]);

    return [detectionData, detectionCount, setDetectionCount];
}
