/**
 * Array Utilities
 * Common array manipulation functions
 */

/**
 * Check if array is empty
 * @param {Array} arr - Input array
 * @returns {boolean} True if array is empty or not an array
 */
export const isEmpty = (arr) => {
    return !Array.isArray(arr) || arr.length === 0;
};

/**
 * Get unique items from array
 * @param {Array} arr - Input array
 * @param {string} key - Optional property key for object arrays
 * @returns {Array} Array with unique items
 */
export const getUnique = (arr, key = null) => {
    if (!Array.isArray(arr)) return [];

    if (key) {
        return [...new Map(arr.map((item) => [item[key], item])).values()];
    }

    return [...new Set(arr)];
};

/**
 * Group array items by a property
 * @param {Array} arr - Input array
 * @param {string} key - Property to group by
 * @returns {Object} Grouped object
 */
export const groupBy = (arr, key) => {
    if (!Array.isArray(arr)) return {};

    return arr.reduce((acc, item) => {
        const groupKey = item[key];
        if (!acc[groupKey]) {
            acc[groupKey] = [];
        }
        acc[groupKey].push(item);
        return acc;
    }, {});
};

/**
 * Find item in array by property value
 * @param {Array} arr - Input array
 * @param {string} key - Property key
 * @param {*} value - Property value to match
 * @returns {*} Found item or undefined
 */
export const findByKey = (arr, key, value) => {
    if (!Array.isArray(arr)) return undefined;
    return arr.find((item) => item[key] === value);
};

export default {
    isEmpty,
    getUnique,
    groupBy,
    findByKey,
};
