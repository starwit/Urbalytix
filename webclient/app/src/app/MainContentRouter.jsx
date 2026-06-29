import {Route, Routes, Navigate} from 'react-router-dom';
import Layout from './commons/Layout';
import LandingLayout from './commons/LandingLayout';
import Vehicles from './features/adminarea/vehicle/Vehicles';
import LandingPage from './features/landing/LandingPage';
import DetectionOverview from './features/detection/DetectionOverview';
import StreetCatalog from './features/adminarea/streetcatalog/StreetCatalog';
import DetectionComparison from './features/comparision/DetectionComparison';
import Configuration from './features/adminarea/config/Configuration';

/**
 * Main Content Router
 * Defines all application routes and their layouts
 * @returns {React.ReactNode}
 */
function MainContentRouter() {
    /**
     * Handle logout action
     * Redirects to API logout endpoint
     */
    const handleLogout = () => {
        window.location.href = `${window.location.pathname}api/user/logout`;
    };

    return (
        <Routes>
            {/* Landing Pages */}
            <Route
                path="/"
                element={
                    <LandingLayout>
                        <LandingPage />
                    </LandingLayout>
                }
            />
            <Route
                path="/landing"
                element={
                    <LandingLayout>
                        <LandingPage />
                    </LandingLayout>
                }
            />

            {/* Main Application Pages */}
            <Route
                path="/status"
                element={
                    <Layout>
                        <DetectionOverview />
                    </Layout>
                }
            />
            <Route
                path="/diff"
                element={
                    <Layout>
                        <DetectionComparison />
                    </Layout>
                }
            />

            {/* Admin Pages */}
            <Route
                path="/vehicles"
                element={
                    <Layout>
                        <Vehicles />
                    </Layout>
                }
            />
            <Route
                path="/streetcatalog"
                element={
                    <Layout>
                        <StreetCatalog />
                    </Layout>
                }
            />
            <Route
                path="/configuration"
                element={
                    <Layout>
                        <Configuration />
                    </Layout>
                }
            />

            {/* Logout Route */}
            <Route path="/logout" element={<LogoutRedirect onLogout={handleLogout} />} />

            {/* Catch all - redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

/**
 * Logout Redirect Component
 * Handles logout redirection
 * @param {Object} props - Component props
 * @param {Function} props.onLogout - Logout handler
 * @returns {null}
 */
function LogoutRedirect({onLogout}) {
    React.useEffect(() => {
        onLogout();
    }, [onLogout]);
    return null;
}

LogoutRedirect.propTypes = {
    onLogout: PropTypes.func.isRequired,
};

import React from 'react';
import PropTypes from 'prop-types';

export default MainContentRouter;
