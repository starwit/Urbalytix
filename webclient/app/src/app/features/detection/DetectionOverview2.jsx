import {useEffect, useMemo, useState} from "react";
import DateFilter from "../../commons/filter/DateFilter";
import DetectionMap from '../../commons/geographicalMaps/DetectionMap2';
import FeatureCollectorRest from '../../services/FeatureCollectorRest';
import {useVehicleData} from "./hooks/useVehicleData";
import {useDetectionCount} from "./hooks/useDetectionCount";
import FilterLayout from "../../commons/filter/FilterLayout";
import FeatureFilter from "../../commons/filter/FeatureFilter";

const VIEW_STATE = {
    longitude: 10.800000000000000,
    latitude: 52.41988232741599,
    zoom: 13,
    pitch: 0,
    bearing: 0
};

function DetectionOverview() {
    const [detectionData, detectionCount, setDetectionCount] = useDetectionCount(1000);
    const vehicleData = useVehicleData(2000);
    const [features, setFeatures] = useState([]);
    const [selectedFeatureKeys, setSelectedFeatureKeys] = useState([]);
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const featureCollectorRest = useMemo(() => new FeatureCollectorRest(), []);

    useEffect(() => {
        reloadFeatures();
    }, []);

    useEffect(() => {
        setSelectedFeatures(selectedFeatureKeys.reduce((obj, key) => {
            obj[key] = features[key]; return obj;
        }, {}));
    }, [selectedFeatureKeys, features]);

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


    return (
        <>
            <FilterLayout leftPosition={10}>
                <DateFilter
                    timeFilter={detectionCount}
                    onTimeFilterChange={setDetectionCount}
                />
                <FeatureFilter
                    availableFeatureKeys={Object.keys(features)}
                    selectedFeatureKeys={selectedFeatureKeys}
                    onSelectedFeatureChange={setSelectedFeatureKeys}
                />
            </FilterLayout>
            <DetectionMap
                viewState={VIEW_STATE}
                detectionData={detectionData}
                features={selectedFeatures}
                positionData={vehicleData}
            />
        </>
    );
};

export default DetectionOverview;