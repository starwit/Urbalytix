/**
 * Common Utility Hooks
 * Reusable hooks for common patterns across the application
 */

import {useState, useCallback} from 'react';

/**
 * Hook for managing async loading state and error handling
 * @param {Function} asyncFunction - Async function to execute
 * @returns {Object} Loading state, error, and execute function
 */
export const useAsync = (asyncFunction) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(
        async (...args) => {
            try {
                setIsLoading(true);
                setError(null);
                return await asyncFunction(...args);
            } catch (err) {
                setError(err);
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        [asyncFunction]
    );

    return {isLoading, error, execute};
};

/**
 * Hook for managing boolean state with convenience methods
 * @param {boolean} initialValue - Initial state value
 * @returns {Object} Current state and toggle/set methods
 */
export const useToggle = (initialValue = false) => {
    const [value, setValue] = useState(initialValue);

    const toggle = useCallback(() => {
        setValue((prev) => !prev);
    }, []);

    const setTrue = useCallback(() => {
        setValue(true);
    }, []);

    const setFalse = useCallback(() => {
        setValue(false);
    }, []);

    return {
        value,
        toggle,
        setTrue,
        setFalse,
        setValue,
    };
};

/**
 * Hook for managing form input state
 * @param {Object} initialValues - Initial form values
 * @returns {Object} Form state and handlers
 */
export const useForm = (initialValues) => {
    const [values, setValues] = useState(initialValues);
    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});

    const handleChange = useCallback((event) => {
        const {name, value, type, checked} = event.target;
        setValues((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }, []);

    const handleBlur = useCallback((event) => {
        const {name} = event.target;
        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));
    }, []);

    const reset = useCallback(() => {
        setValues(initialValues);
        setTouched({});
        setErrors({});
    }, [initialValues]);

    const setFieldValue = useCallback((name, value) => {
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    const setFieldError = useCallback((name, error) => {
        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));
    }, []);

    return {
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
        reset,
        setFieldValue,
        setFieldError,
    };
};

export default {
    useAsync,
    useToggle,
    useForm,
};
