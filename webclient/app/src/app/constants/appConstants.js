/**
 * Application Constants
 * Centralized location for all magic numbers, strings, and configuration values
 */

// Map Configuration
export const MAP_CONFIG = {
    DEFAULT_CENTER: {
        longitude: 10.785000000000000,
        latitude: 52.41788232741599,
    },
    DEFAULT_ZOOM: 15,
    DEFAULT_PITCH: 0,
    DEFAULT_BEARING: 0,
    PITCH_3D: 60,
};

// Data Fetch Configuration
export const DATA_FETCH_CONFIG = {
    VEHICLE_DATA_TIMEOUT: 2000,
    DEFAULT_PAGE_SIZE: 25,
    DEFAULT_RETRY_ATTEMPTS: 3,
};

// Toast/Notification Configuration
export const NOTIFICATION_CONFIG = {
    POSITION: 'bottom-left',
    AUTO_CLOSE_DELAY: 3000,
    MAX_NOTIFICATIONS: 1,
};

// Date/Time Configuration
export const DATE_TIME_CONFIG = {
    FORMAT: 'YYYY-MM-DD',
    TIME_FORMAT: 'HH:mm:ss',
    DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
};

// UI Spacing
export const SPACING = {
    CONTAINER_PADDING_TOP: '5em',
    CONTAINER_PADDING_BOTTOM: '4em',
    APPBAR_HEIGHT: 40,
};

// Filter Configuration
export const FILTER_CONFIG = {
    DEFAULT_FILTERS: [
        {value: 0, label: 'selection.currentPosition'},
    ],
};

// API Response Status
export const API_STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
};

// Role/Permission Constants
export const PERMISSIONS = {
    VIEW: 'view',
    EDIT: 'edit',
    DELETE: 'delete',
    ADMIN: 'admin',
};

// Feature Flags
export const FEATURES = {
    ENABLE_3D_VIEW: true,
    ENABLE_VEHICLE_TRACKING: true,
    ENABLE_STREET_CATALOG: true,
};

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'error.network',
    LOADING_ERROR: 'error.loading',
    INVALID_INPUT: 'error.invalidInput',
    SERVER_ERROR: 'error.server',
    NOT_FOUND: 'error.notFound',
    UNAUTHORIZED: 'error.unauthorized',
};

export default {
    MAP_CONFIG,
    DATA_FETCH_CONFIG,
    NOTIFICATION_CONFIG,
    DATE_TIME_CONFIG,
    SPACING,
    FILTER_CONFIG,
    API_STATUS,
    PERMISSIONS,
    FEATURES,
    ERROR_MESSAGES,
};
