import {GridLayer, HeatmapLayer, HexagonLayer} from "@deck.gl/aggregation-layers";
import {MaskExtension} from "@deck.gl/extensions";
import {TileLayer} from "@deck.gl/geo-layers";
import {BitmapLayer, GridCellLayer, IconLayer, PolygonLayer, ScatterplotLayer} from "@deck.gl/layers";
import {TILE_LAYER_CONFIG} from './BaseMapConfig';

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

    static createMaskingLayers(data) {
        return [
            new HeatmapLayer({
                id: 'coverage-mask',
                radiusPixels: 10,
                data: data,
                getPosition: d => [d.longitude, d.latitude],
                cellSize: 10,
                extruded: false,
                operation: 'mask',
            }),
            new PolygonLayer({
                id: 'coverage-layer',
                data: [{
                    polygon: [
                        [0, 60], 
                        [20, 60], 
                        [20, 40], 
                        [0, 40],
                    ]
                }],
                getFillColor: [0, 0, 0, 128],
                extruded: false,
                stroked: false,
                filled: true,
                maskId: 'coverage-mask',
                maskByInstance: false,
                maskInverted: true,
                extensions: [new MaskExtension()],
            }),
        ];
    }

    static createHeatmapDetectionLayer(detectionData, colorRange, options = {}) {
        return new HeatmapLayer({
            data: detectionData,
            getPosition: d => [d.longitude, d.latitude],
            getWeight: d => d.count || 1,
            aggregation: 'MAX',
            colorRange,
            radiusPixels: options.radiusPixels || 40,
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

    static createScatterplotLayer(data, colorProp = 'undefined', layerID, options = {}) {
        return new ScatterplotLayer({
            data: data,
            getPosition: d => [d.longitude, d.latitude],
            getRadius: 10,
            getFillColor: d => MapLayerFactory.stringToColor(d[colorProp], d.count),
            pickable: true,
            radiusMinPixels: 3,
            radiusMaxPixels: 10,
            ...options
        });
    }

    static createGridCellLayer(data, options = {}) {

        return new GridCellLayer({
            id: 'GridCellLayer',
            data: data,

            cellSize: 1,
            extruded: false,
            elevationScale: 6,
            getElevation: d => d.count,
            getFillColor: d => [48, 128, d.count * 255, 255],
            getPosition: d => [d.longitude, d.latitude],
            pickable: true,
            ...options
        });
    }

    static createHexagonLayer(data, options = {}) {
        return new HexagonLayer({
            id: 'hexagon-layer',
            data: data,
            radius: 3,
            elevationScale: 0.1,
            opacity: 0.4,
            extruded: true,
            pickable: true,
            getTooltip: true,
            gpuAggregation: false, //needed to get data for tooltip!!!
            colorAggregation: 'MAX',
            elevationAggregation: 'MAX',
            getColorWeight: d => d.count,
            getElevationWeight: d => d.count,
            upperPercentile: 99.9,
            elevationDomain: [0, 20],
            getPosition: d => [d.longitude, d.latitude],
            ...options
        });
    }

    static createRouteLayer(routeData, layerID) {
        return new ScatterplotLayer({
            id: `ScatterplotLayer-route-points-${layerID}`,
            data: routeData,
            getPosition: d => [d.longitude, d.latitude],
            radiusMinPixels: 2,
            getRadius: 5,
            getFillColor: [50, 100, 200, 150],
            pickable: true
        });
    }

    static stringToColor(text, count) {
        if (!text) {
            text = "undefined";
        }
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            hash = text.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = [];
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xFF;
            color.push(value - 30);
        }
        return [...color, count * 25.5 || 50];
    }
}
