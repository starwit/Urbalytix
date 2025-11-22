import {useContext, useEffect, useMemo, useState} from "react";
import FeatureCollectorRest from '../../../services/FeatureCollectorRest';
import {FilterContext} from "../../../commons/FilterProvider";

export function useFeatures() {
    const {featureKeys, setFeatureKeys} = useContext(FilterContext);
    const [features, setFeatures] = useState([]);
    const [selectedFeatureKeys, setSelectedFeatureKeys] = useState([]);
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const featureCollectorRest = useMemo(() => new FeatureCollectorRest(), []);

    useEffect(() => {
        reloadFeatures();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        setSelectedFeatures(selectedFeatureKeys.reduce((obj, key) => {
            obj[key] = features[key];
            return obj;
        }, {}));
        setFeatureKeys(selectedFeatureKeys)
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
        if (selectedFeatureKeys.length === 0) {
            setSelectedFeatureKeys(featureKeys);
        }
        setFeatures(groupedFeatures);
    }

    return {
        features,
        reloadFeatures,
        selectedFeatureKeys,
        setSelectedFeatureKeys,
        selectedFeatures,
        setSelectedFeatures
    };
}
