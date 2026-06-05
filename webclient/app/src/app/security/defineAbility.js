import {defineAbility} from '@casl/ability';

/**
 * Defines the ability for the current user based on their roles.
 * @param {string[]} roles - Array of user roles
 * @returns {Ability} The CASL ability instance
 */
export function defineUserAbility(roles = []) {
    return defineAbility((can, cannot) => {
        // Admin can do everything
        if (roles.includes('admin')) {
            can('manage', ['all', 'app', 'config', 'admin']);
        } else {
            // User role can read/view most things
            if (roles.includes('user')) {
                can(['read', 'create', 'update'], ['app', 'config']);
            }

            // Reader role can only read
            if (roles.includes('reader')) {
                can('read', 'app');
            }

            // By default, cannot access configuration
            cannot('manage', 'admin');
        }
    });
}

export const Actions = {
    MANAGE: 'manage',
    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete',
};

export const Subjects = {
    APP: 'app',
    CONFIG: 'config',
    ADMIN: 'admin',
    ALL: 'all'
};
