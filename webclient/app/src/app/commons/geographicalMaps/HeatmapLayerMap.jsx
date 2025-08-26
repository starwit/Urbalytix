import DeckGL from "@deck.gl/react";
import {useEffect, useState, useMemo} from "react";
import {MapLayerFactory} from './MapLayerFactory';
import {MAP_VIEW, HEATMAP_COLOR_RANGES} from './BaseMapConfig';
import recyclingImage from "../../assets/icons/recycling.png"
import MapFilter from "./MapFilter";

const ICON_MAPPING_URL = 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.json';

function HeatmapLayerMap(props) {
    const {latitude, longitude, data: heatMapData, features, objectClasses, selectedTimeFilter, onTimeFilterChange} = props;

    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const [selectedObjectClasses, setSelectedObjectClasses] = useState([]);

    const INITIAL_VIEW_STATE = {
        longitude,
        latitude,
        zoom: 19,
        pitch: 0,
        bearing: 0
    };
    const [iconMapping, setIconMapping] = useState(null);

    useEffect(() => {
        fetch(ICON_MAPPING_URL)
            .then(res => res.json())
            .then(data => setIconMapping(data))
            .catch(err => console.error('Failed to load icon mapping', err));
    }, []);

    useEffect(() => {
        setSelectedFeatures(Object.keys(features));
    }, [features]);

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
            if (selectedObjectClasses.includes(getNameForObjectClass(d.classId))) {
                return true;
            }
            return false;
        });

        function getNameForObjectClass(idOfClass) {
            for (const [key, value] of Object.entries(objectClasses)) {
                if (value === idOfClass) {
                    return key;
                }
            }
        }

        return [
            MapLayerFactory.createBaseMapLayer(),
            MapLayerFactory.createHeatmapLayer(filteredHeatMapData, HEATMAP_COLOR_RANGES.redScale, {
                id: 'HeatmapLayer',
            }),
            ...Object.entries(selectedLayers).map(([objectType, featureList], index) =>
                MapLayerFactory.createIconLayer(featureList, objectType, index, iconMapping, recyclingImage)
            )
        ];
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

export default HeatmapLayerMap;
