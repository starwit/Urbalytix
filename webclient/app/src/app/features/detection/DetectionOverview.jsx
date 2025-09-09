import {useEffect, useMemo, useState} from "react";
import DetectionMap from '../../commons/geographicalMaps/DetectionMap';
import DetectionCountRest from "../../services/DetectionCountRest";
import FeatureCollectorRest from '../../services/FeatureCollectorRest';
import VehicleDataRest from '../../services/VehicleDataRest';

const VIEW_STATE = {
    longitude: 10.800000000000000,
    latitude: 52.41988232741599,
    zoom: 13,
    pitch: 0,
    bearing: 0
};

function DetectionOverview() {
    const [data, setData] = useState([]);
    const detectionCountRest = useMemo(() => new DetectionCountRest(), []);
    const [features, setFeatures] = useState([]);
    const featureCollectorRest = useMemo(() => new FeatureCollectorRest(), []);
    const [objectClasses, setObjectClasses] = useState([]);
    const [selectedTimeFilter, setSelectedTimeFilter] = useState(24);
    const vehicleDataRest = useMemo(() => new VehicleDataRest(), []);
    const [vehicleData, setVehicleData] = useState([]);

    useEffect(() => {
        reloadDetectionCounts();
        reloadFeatures();
        reloadObjectClasses();
        loadVehicleData();
        const interval = setInterval(loadVehicleData, 2000);
        return () => clearInterval(interval);
    }, []);

    const selectedTimeRange = useMemo(() => {
        reloadDetectionCounts(selectedTimeFilter);
        return selectedTimeFilter;
    }, [selectedTimeFilter]);

    function reloadDetectionCounts(timeFilter) {
        if (timeFilter === undefined) {
            timeFilter = 24;
        }
        const end = Date.now();
        const start = new Date((new Date()).getTime() - timeFilter * 60 * 60 * 1000).getTime();
        detectionCountRest.findByTimeFrame(Math.floor(start / 1000), Math.floor(end / 1000)).then(response => handleLoadDecisions(response));
    }

    function reloadObjectClasses() {
        detectionCountRest.getObjectClasses().then(response => {
            setObjectClasses(response.data);
        });
    }

    function handleLoadDecisions(response) {
        if (response.data == null) {
            return;
        }
        setData(response.data)
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
            <DetectionMap
                viewState={VIEW_STATE}
                selectedTimeFilter={selectedTimeRange}
                onTimeFilterChange={setSelectedTimeFilter}
                data={data}
                features={features}
                objectClasses={objectClasses}
                vehicleData={vehicleData}
            />
        </>
    );
};

export default DetectionOverview;