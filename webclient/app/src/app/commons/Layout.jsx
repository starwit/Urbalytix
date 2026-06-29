import PropTypes from 'prop-types';
import {Container} from '@mui/material';
import CustomAppBar from './CustomAppBar';
import CustomFooter from './CustomFooter';
import {FilterProvider} from './FilterProvider';
import {SPACING} from '../constants/appConstants';

/**
 * Main Layout Component
 * Wraps page content with app bar, footer, and filter provider
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 * @returns {React.ReactNode}
 */
function Layout({children}) {
    return (
        <>
            <CustomAppBar />
            <Container
                sx={{
                    paddingTop: SPACING.CONTAINER_PADDING_TOP,
                    paddingBottom: SPACING.CONTAINER_PADDING_BOTTOM,
                }}
            >
                <FilterProvider>
                    {children}
                </FilterProvider>
            </Container>
            <CustomFooter />
        </>
    );
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;