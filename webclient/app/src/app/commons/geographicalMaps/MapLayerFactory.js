import {TileLayer} from "@deck.gl/geo-layers";
import {TILE_LAYER_CONFIG} from './BaseMapConfig';
import {HeatmapLayer} from "@deck.gl/aggregation-layers";
import {BitmapLayer, PathLayer, ScatterplotLayer} from "@deck.gl/layers";
import {IconLayer} from '@deck.gl/layers';

export class MapLayerFactory {
    static createBaseMapLayer() {
        return new TileLayer({
            ...TILE_LAYER_CONFIG,
            renderSubLayers: props => {
                const {
                    bbox: {west, south, east, north}
                } = props.tile;

                return new BitmapLayer(props, {
                    data: null,
                    image: props.data,
                    bounds: [west, south, east, north]
                });
            }
        });
    }

    static createHeatmapDetectionLayer(detectionData, colorRange, options = {}) {
        return new HeatmapLayer({
            id: options.id || 'heatmap-layer',
            data: detectionData,
            getPosition: d => [d.longitude, d.latitude],
            getWeight: d => d.count || 1,
            aggregation: 'SUM',
            colorRange,
            radiusPixels: options.radiusPixels || 25,
            ...options
        });
    }

    static createIconLayer(iconData, objectType, colorIndex, iconMapping, iconAtlas) {
        const colors = [
            [155, 50, 50],    // Redish
            [100, 155, 100],  // Green
            [50, 50, 155],    // Blue
            [185, 185, 0],    // Yellow
            [255, 0, 255],    // Magenta
            [0, 255, 255]     // Cyan
        ];

        return new IconLayer({
            id: `IconLayer-${objectType}`,
            data: iconData,
            getColor: d => colors[colorIndex % colors.length],
            getIcon: d => 'marker',
            getPosition: d => d.geometry.coordinates,
            getSize: 40,
            iconAtlas: iconAtlas,
            iconMapping: iconMapping,
            pickable: true
        });
    }

    static createPositionLayer(positionData, iconMapping, icon) {
        return new IconLayer({
            id: `IconLayer-vehicle-positions`,
            data: positionData,
            getColor: d => d.status === 'online' ? [100, 155, 100] : [155, 50, 50],
            getIcon: d => 'marker',
            getPosition: d => [d.longitude, d.latitude],
            getSize: 40,
            iconAtlas: icon,
            iconMapping: iconMapping,
            pickable: true
        });
    }

    static createRouteLayer(routeData, layerID) {
        return new ScatterplotLayer({
            id: `ScatterplotLayer-route-points-${layerID}`,
            data: routeData,
            getPosition: d => [d.longitude, d.latitude],
            getRadius: 3,
            getFillColor: [150, 100, 100],
            pickable: true
        });
    }
}
