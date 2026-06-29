/**
 * Axios Instance Configuration
 * Centralized axios setup with interceptors
 */

import axios from 'axios';
import {getApiBaseUrl} from '../../config/appConfig';
import {handleApiError} from './ApiErrorHandler';

/**
 * Create and configure axios instance
 * @returns {AxiosInstance} Configured axios instance
 */
export const createApiClient = () => {
    const instance = axios.create({
        baseURL: getApiBaseUrl(),
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Request interceptor
    instance.interceptors.request.use(
        (config) => {
            // Add auth token if available
            const token = localStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            const apiError = handleApiError(error);
            return Promise.reject(apiError);
        }
    );

    return instance;
};

/**
 * Default axios instance
 */
export const apiClient = createApiClient();

export default apiClient;
