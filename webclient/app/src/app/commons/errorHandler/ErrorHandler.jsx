import {useEffect} from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';
import {apiClient} from '../../services/api/apiClient';

/**
 * Global Error Handler Component
 * Sets up centralized error handling for all API requests
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactNode} Child components wrapped with error handling
 */
function ErrorHandler({children}) {
    const {t} = useTranslation();

    useEffect(() => {
        /**
         * Handle API errors with user-friendly messages
         */
        const setupErrorHandling = () => {
            const responseInterceptor = apiClient.interceptors.response.use(
                (response) => response,
                (error) => {
                    let errorMessage = 'error.unknown';

                    if (error?.request && !error?.response) {
                        // Network error
                        if (navigator.onLine) {
                            errorMessage = 'error.serverOffline';
                            console.error('Server cannot be reached.');
                        } else {
                            errorMessage = 'error.userOffline';
                            console.log('User seems to be offline. Cannot complete request.');
                        }
                    } else if (error?.response) {
                        // Server response with error status
                        const {config, data, status} = error.response;

                        // Use backend error message if available
                        if (data?.messageKey) {
                            errorMessage = data.messageKey;
                        } else {
                            // Map HTTP method to error message
                            const methodErrorMap = {
                                get: 'error.general.get',
                                delete: 'error.general.delete',
                                post: 'error.general.create',
                                put: 'error.general.update',
                            };

                            errorMessage = methodErrorMap[config?.method] || 'error.unknown';
                        }

                        console.error(
                            `A ${config?.method} request failed with status code ${status}:`,
                            data,
                            config
                        );
                    }

                    // Display error toast
                    toast.error(t(errorMessage), {
                        position: 'bottom-left',
                        autoClose: 3000,
                    });

                    return Promise.reject(error);
                }
            );

            return () => {
                apiClient.interceptors.response.eject(responseInterceptor);
            };
        };

        setupErrorHandling();
    }, [t]);

    return children;
}

ErrorHandler.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ErrorHandler;
