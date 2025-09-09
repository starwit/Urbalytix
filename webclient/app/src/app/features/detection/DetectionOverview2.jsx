import {use, useEffect, useMemo, useState} from "react";
import DetectionMap from '../../commons/geographicalMaps/DetectionMap2';
import DetectionCountRest from "../../services/DetectionCountRest";
import FeatureCollectorRest from '../../services/FeatureCollectorRest';
import VehicleDataRest from '../../services/VehicleDataRest';
import DateFilter from "../../commons/geographicalMaps/DateFilter";

const VIEW_STATE = {
    longitude: 10.800000000000000,
    latitude: 52.41988232741599,
    zoom: 13,
    pitch: 0,
    bearing: 0
};

function DetectionOverview() {
    const [detectionCount, setDetectionCount] = useState(1000);
    const [detectionData, setDetectionData] = useState([]);
    const detectionCountRest = useMemo(() => new DetectionCountRest(), []);
    const [features, setFeatures] = useState([]);
    const featureCollectorRest = useMemo(() => new FeatureCollectorRest(), []);
    const vehicleDataRest = useMemo(() => new VehicleDataRest(), []);
    const [vehicleData, setVehicleData] = useState([]);



    useEffect(() => {
        reloadDetectionCounts();
        reloadFeatures();
        loadVehicleData();
        const interval = setInterval(loadVehicleData, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        reloadDetectionCounts();
    }, [detectionCount]);

    function reloadDetectionCounts() {
        detectionCountRest.findAllLimited(detectionCount).then(response => handleLoadDecisions(response));
    }


    function handleLoadDecisions(response) {
        if (response.data == null) {
            return;
        }
        setDetectionData(response.data)
    }

    function reloadFeatures() {
        featureCollectorRest.findAll().then(response => handleLoadFeatures(response));
    }

    function handleLoadFeatures(response) {
        if (response.data == null) {
            return;
        }

        var list = response.data.features;
        const groupedFeatures = list.reduce((acc, feature) => {
            const objectType = feature.properties.objectTypeLabel;
            if (!acc[objectType]) {
                acc[objectType] = [];
            }
            acc[objectType].push(feature);
            return acc;
        }, {});

        setFeatures(groupedFeatures);
    }

    function loadVehicleData() {
        vehicleDataRest.findAllFormatted().then(response => {
            if (response.data == null) {
                return;
            }
            setVehicleData(response.data);
        });
    }

    return (
        <>
            <DateFilter
                timeFilter={detectionCount}
                onTimeFilterChange={setDetectionCount}
            />
            <DetectionMap
                viewState={VIEW_STATE}
                detectionData={detectionData}
                features={features}
                positionData={vehicleData}
            />
        </>
    );
};

export default DetectionOverview;