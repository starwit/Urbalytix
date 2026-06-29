import PropTypes from 'prop-types';
import LogoutIcon from '@mui/icons-material/Logout';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
import DifferenceIcon from '@mui/icons-material/Difference';
import {
    AppBar,
    Container,
    Divider,
    IconButton,
    Stack,
    Toolbar,
    Typography,
} from '@mui/material';
import generalLogo from '../assets/images/logo_color.png';
import AdminMenu from '../features/adminarea/AdminMenu';

/**
 * Custom Application Bar Component
 * Displays application title, logo, and main navigation
 * @returns {React.ReactNode}
 */
function CustomAppBar() {
    const appTitle = import.meta.env.VITE_TITLE || 'Urbalytix';

    return (
        <Container>
            <AppBar color="secondary">
                <Toolbar>
                    {/* Logo and Title Section */}
                    <Stack direction="row" sx={{justifyContent: 'flex-start'}}>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            href="./"
                            aria-label="home"
                            sx={{margin: 0, padding: 0, marginRight: 2}}
                        >
                            <img src={generalLogo} height={40} alt={appTitle} />
                        </IconButton>
                        <Typography variant="h1" component="div" noWrap>
                            {appTitle}
                        </Typography>
                    </Stack>

                    {/* Navigation Buttons Section */}
                    <Stack
                        direction="row"
                        spacing={0}
                        sx={{justifyContent: 'flex-end', flex: 1}}
                    >
                        {/* Status Button */}
                        <IconButton href="#/status" size="large" aria-label="status">
                            <AutoDeleteIcon />
                        </IconButton>

                        {/* Comparison Button */}
                        <IconButton href="#/diff" size="large" aria-label="comparison">
                            <DifferenceIcon />
                        </IconButton>

                        <Divider orientation="vertical" variant="middle" flexItem />

                        {/* Admin Menu */}
                        <AdminMenu />

                        <Divider orientation="vertical" variant="middle" flexItem />

                        {/* Logout Button */}
                        <IconButton href="./logout" size="large" aria-label="logout">
                            <LogoutIcon />
                        </IconButton>
                    </Stack>
                </Toolbar>
            </AppBar>
        </Container>
    );
}

CustomAppBar.propTypes = {};

export default CustomAppBar;
