import DeckGL from "@deck.gl/react";
import {useEffect, useState, useMemo} from "react";
import {MapLayerFactory} from './MapLayerFactory';
import {MAP_VIEW, HEATMAP_COLOR_RANGES} from './BaseMapConfig';
import recyclingImage from "../../assets/icons/recycling.png"
import vehicleImage from "../../assets/icons/vehicle.png"
import MapFilter from "./MapFilter";

const ICON_MAPPING = {
    "marker": {
        "x": 0,
        "y": 0,
        "width": 128,
        "height": 128,
        "anchorY": 128,
        "mask": true
    },
    "marker-warning": {
        "x": 128,
        "y": 0,
        "width": 128,
        "height": 128,
        "anchorY": 128,
        "mask": false
    }
}

function DetectionMap(props) {
    const {latitude, longitude, data: heatMapData, features, objectClasses, selectedTimeFilter, onTimeFilterChange, vehicleData} = props;

    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const [selectedObjectClasses, setSelectedObjectClasses] = useState([]);
    const [selectedVehicleData, setSelectedVehicleData] = useState([]);

    const INITIAL_VIEW_STATE = {
        longitude,
        latitude,
        zoom: 19,
        pitch: 0,
        bearing: 0
    };

    // useEffect(() => {
    //     setSelectedFeatures(Object.keys(features));
    // }, [features]);

    useEffect(() => {
        setSelectedObjectClasses(objectClasses)
    }, [objectClasses]);

    const filteredFeatures = useMemo(() => {
        var availableFeatures = Object.keys(features);
        return availableFeatures.filter(f => {
            if (!selectedFeatures.includes(f)) {
                return false;
            }
            return true;
        });
    }, [selectedFeatures]);

    const layers = useMemo(() => {

        var selectedLayers = Object.keys(features)
            .filter(key => selectedFeatures.includes(key))
            .reduce((obj, key) => {
                obj[key] = features[key]; return obj;
            }, {});

        var filteredHeatMapData = heatMapData.filter(d => {
            if (selectedObjectClasses.includes(d.className)) {
                return true;
            }
            return false;
        });

        var result = [
            MapLayerFactory.createBaseMapLayer(),
            MapLayerFactory.createHeatmapLayer(filteredHeatMapData, HEATMAP_COLOR_RANGES.redScale, {
                id: 'HeatmapLayer',
            }),
            ...Object.entries(selectedLayers).map(([objectType, featureList], index) =>
                MapLayerFactory.createIconLayer(featureList, objectType, index, ICON_MAPPING, recyclingImage)
            )
        ];
        if (selectedVehicleData.includes("selection.currentPosition")) {
            result.push(MapLayerFactory.createVehiclePositionLayer(vehicleData, ICON_MAPPING, vehicleImage));
        }

        return result;
    });

    return (
        <>
            <MapFilter
                objectClasses={objectClasses}
                selectedObjectClasses={selectedObjectClasses}
                onSelectedObjectClassesChange={setSelectedObjectClasses}
                availableFeatures={Object.keys(features)}
                selectedFeatures={filteredFeatures}
                onSelectedFeatureChange={setSelectedFeatures}
                timeFilter={selectedTimeFilter}
                onTimeFilterChange={onTimeFilterChange}
                selectedVehicleData={selectedVehicleData}
                onSelectedVehicleData={setSelectedVehicleData}
            />
            <DeckGL
                layers={layers}
                views={MAP_VIEW}
                initialViewState={INITIAL_VIEW_STATE}
                controller={{dragRotate: false}}
            />
        </>
    );
}

export default DetectionMap;
