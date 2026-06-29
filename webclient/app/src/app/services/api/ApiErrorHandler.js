/**
 * API Error Handler
 * Centralized error handling for all API requests
 */

export class ApiError extends Error {
    /**
     * Create an API Error
     * @param {string} message - Error message
     * @param {number} status - HTTP status code
     * @param {Object} response - Axios response object
     */
    constructor(message, status = null, response = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.response = response;
    }

    /**
     * Check if error is a network error
     * @returns {boolean}
     */
    isNetworkError() {
        return !this.status;
    }

    /**
     * Check if error is a client error (4xx)
     * @returns {boolean}
     */
    isClientError() {
        return this.status >= 400 && this.status < 500;
    }

    /**
     * Check if error is a server error (5xx)
     * @returns {boolean}
     */
    isServerError() {
        return this.status >= 500;
    }

    /**
     * Check if error is an unauthorized error (401)
     * @returns {boolean}
     */
    isUnauthorized() {
        return this.status === 401;
    }

    /**
     * Check if error is a not found error (404)
     * @returns {boolean}
     */
    isNotFound() {
        return this.status === 404;
    }
}

/**
 * Handle API errors consistently
 * @param {Error} error - Axios error
 * @returns {ApiError} Formatted API error
 */
export const handleApiError = (error) => {
    if (error.response) {
        // Server responded with error status
        const {status, data} = error.response;
        const message = data?.message || data?.error || error.message || 'Unknown error';
        return new ApiError(message, status, error.response);
    } else if (error.request) {
        // Request made but no response received
        return new ApiError('No response from server', null, error.request);
    } else {
        // Error in request setup
        return new ApiError(error.message, null, null);
    }
};

/**
 * Get user-friendly error message
 * @param {ApiError|Error} error - Error object
 * @param {Object} translations - i18next translation object
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error, translations = null) => {
    if (!error) return 'Unknown error';

    if (error.isNetworkError?.()) {
        return translations?.t?.('error.network') || 'Network error. Please check your connection.';
    }

    if (error.isUnauthorized?.()) {
        return translations?.t?.('error.unauthorized') || 'You are not authorized to perform this action.';
    }

    if (error.isNotFound?.()) {
        return translations?.t?.('error.notFound') || 'Resource not found.';
    }

    if (error.isServerError?.()) {
        return translations?.t?.('error.server') || 'Server error. Please try again later.';
    }

    return error.message || 'An unexpected error occurred.';
};

export default {
    ApiError,
    handleApiError,
    getErrorMessage,
};
