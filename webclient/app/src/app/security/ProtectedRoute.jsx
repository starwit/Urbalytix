import React from 'react';
import {useAbility} from '@casl/react';
import {Alert} from '@mui/material';

/**
 * ProtectedRoute component that checks user abilities before rendering
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component to render if user has permission
 * @param {string} props.action - Action to check (e.g., 'manage', 'read', 'create')
 * @param {string} props.subject - Subject to check (e.g., 'Configuration', 'all')
 * @param {React.ReactNode} props.fallback - Component to render if user doesn't have permission (optional)
 * @returns {React.ReactNode} Protected component or fallback
 */
export function ProtectedRoute({
    children,
    action = 'manage',
    subject = 'all',
    fallback = null
}) {
    const ability = useAbility();

    if (!ability) {
        return fallback || (
            <Alert severity="error">
                Unable to determine permissions
            </Alert>
        );
    }

    // Check if user can perform the action on the subject
    const canAccess = ability.can(action, subject);

    if (!canAccess) {
        return fallback || (
            <Alert severity="warning">
                You do not have permission to access this resource.
            </Alert>
        );
    }

    return children;
}
