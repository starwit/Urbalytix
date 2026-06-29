import {apiClient} from './api/apiClient';
import {handleApiError} from './api/ApiErrorHandler';

/**
 * Generic CRUD REST client
 * Provides base CRUD operations for any resource
 */
class CrudRest {
    /**
     * Initialize CRUD REST client
     * @param {string} baseUrl - Base URL for the resource
     * @throws {Error} If baseUrl is not provided
     */
    constructor(baseUrl) {
        if (!baseUrl) {
            throw new Error('baseUrl is required');
        }
        this.baseUrl = baseUrl;
    }

    /**
     * Create a new entity
     * @param {Object} entity - Entity to create
     * @returns {Promise} Response promise
     */
    create = (entity) => {
        try {
            return apiClient.post(this.baseUrl, entity);
        } catch (error) {
            throw handleApiError(error);
        }
    };

    /**
     * Update an existing entity
     * @param {Object} entity - Entity to update (must include ID)
     * @returns {Promise} Response promise
     */
    update = (entity) => {
        try {
            return apiClient.put(this.baseUrl, entity);
        } catch (error) {
            throw handleApiError(error);
        }
    };

    /**
     * Delete an entity by ID
     * @param {number|string} entityId - ID of entity to delete
     * @returns {Promise} Response promise
     */
    delete = (entityId) => {
        if (!entityId) {
            throw new Error('entityId is required');
        }
        try {
            return apiClient.delete(`${this.baseUrl}/${entityId}`);
        } catch (error) {
            throw handleApiError(error);
        }
    };

    /**
     * Retrieve all entities
     * @returns {Promise} Response promise with array of entities
     */
    findAll = () => {
        try {
            return apiClient.get(this.baseUrl);
        } catch (error) {
            throw handleApiError(error);
        }
    };

    /**
     * Retrieve a single entity by ID
     * @param {number|string} entityId - ID of entity to retrieve
     * @returns {Promise} Response promise with entity
     */
    findById = (entityId) => {
        if (!entityId) {
            throw new Error('entityId is required');
        }
        try {
            return apiClient.get(`${this.baseUrl}/${entityId}`);
        } catch (error) {
            throw handleApiError(error);
        }
    };
}

export default CrudRest;
