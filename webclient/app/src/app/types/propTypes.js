/**
 * PropTypes Definitions
 * Centralized prop validation for common types
 */

import PropTypes from 'prop-types';

/**
 * Common prop types used across components
 */
export const CommonPropTypes = {
    // Child components
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),

    // IDs
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    entityId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    // Callback functions
    onClick: PropTypes.func,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
    onError: PropTypes.func,
    onSuccess: PropTypes.func,
    onCancel: PropTypes.func,
    onDelete: PropTypes.func,
    onUpdate: PropTypes.func,

    // UI state
    isOpen: PropTypes.bool,
    isLoading: PropTypes.bool,
    isError: PropTypes.bool,
    isSuccess: PropTypes.bool,
    disabled: PropTypes.bool,
    visible: PropTypes.bool,

    // Data
    data: PropTypes.object,
    error: PropTypes.object,
    message: PropTypes.string,
    title: PropTypes.string,
    label: PropTypes.string,

    // Pagination
    page: PropTypes.number,
    pageSize: PropTypes.number,
    totalCount: PropTypes.number,

    // Other
    className: PropTypes.string,
    style: PropTypes.object,
};

/**
 * Shape validators for common objects
 */
export const CommonShapes = {
    // Error shape
    error: PropTypes.shape({
        message: PropTypes.string,
        status: PropTypes.number,
        code: PropTypes.string,
    }),

    // Loading state shape
    loadingState: PropTypes.shape({
        isLoading: PropTypes.bool,
        error: PropTypes.object,
        data: PropTypes.any,
    }),

    // Pagination shape
    pagination: PropTypes.shape({
        page: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        totalCount: PropTypes.number.isRequired,
    }),

    // User shape
    user: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        email: PropTypes.string,
        role: PropTypes.string,
    }),
};

export default {
    CommonPropTypes,
    CommonShapes,
};
