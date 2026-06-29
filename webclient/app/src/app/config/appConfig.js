/**
 * Application Configuration
 * Handles environment-based configuration and feature flags
 */

/**
 * Get the API base URL from environment variables
 * Falls back to window location if not configured
 * @returns {string} API base URL
 */
export const getApiBaseUrl = () => {
    return import.meta.env.VITE_API_BASE_URL || `${window.location.protocol}//${window.location.host}`;
};

/**
 * Get the application title
 * @returns {string} Application title
 */
export const getAppTitle = () => {
    return import.meta.env.VITE_TITLE || 'Urbalytix';
};

/**
 * Get the application environment
 * @returns {string} Environment (development, production, staging, etc.)
 */
export const getEnvironment = () => {
    return import.meta.env.MODE || 'development';
};

/**
 * Check if application is in production
 * @returns {boolean} True if production environment
 */
export const isProduction = () => {
    return getEnvironment() === 'production';
};

/**
 * Check if application is in development
 * @returns {boolean} True if development environment
 */
export const isDevelopment = () => {
    return getEnvironment() === 'development';
};

/**
 * Get debug mode flag
 * @returns {boolean} True if debug mode enabled
 */
export const isDebugMode = () => {
    return import.meta.env.VITE_DEBUG === 'true';
};

/**
 * Get feature flags
 * @returns {Object} Feature flags object
 */
export const getFeatureFlags = () => {
    return {
        enable3DView: import.meta.env.VITE_ENABLE_3D_VIEW !== 'false',
        enableVehicleTracking: import.meta.env.VITE_ENABLE_VEHICLE_TRACKING !== 'false',
        enableStreetCatalog: import.meta.env.VITE_ENABLE_STREET_CATALOG !== 'false',
    };
};

/**
 * Application configuration object
 */
const appConfig = {
    apiBaseUrl: getApiBaseUrl(),
    appTitle: getAppTitle(),
    environment: getEnvironment(),
    isProduction: isProduction(),
    isDevelopment: isDevelopment(),
    isDebugMode: isDebugMode(),
    featureFlags: getFeatureFlags(),
};

export default appConfig;
