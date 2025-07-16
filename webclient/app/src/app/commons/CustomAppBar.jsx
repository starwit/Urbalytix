import LogoutIcon from '@mui/icons-material/Logout';
import {
    AppBar,
    Container,
    Divider,
    IconButton,
    Stack,
    Toolbar,
    Typography
} from "@mui/material";
import React from "react";
import general from "../assets/images/logo_color.png";


function CustomAppBar() {
    const themeMap = {general};
    const DynamicLogo = themeMap["general"];

    return (
        <>
            <Container>
                <AppBar color="secondary">
                    <Toolbar>
                        <Stack
                            direction="row"
                            sx={{justifyContent: "flex-start"}}
                        >
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                href="./"
                                aria-label="menu"
                                sx={{margin: 0, padding: 0, marginRight: 2}}
                            >
                                <img src={DynamicLogo} height={40} alt="Urbalytix" />
                            </IconButton>
                            <Typography variant="h1" component="div" noWrap>
                                {import.meta.env.VITE_TITLE}
                            </Typography>
                        </Stack>
                        <Stack
                            direction="row" spacing={0}
                            sx={{justifyContent: "right", flex: 1}}

                        >
                            <Divider orientation="vertical" variant="middle" flexItem />
                            <IconButton href="./logout" size="large">
                                <LogoutIcon />
                            </IconButton>
                        </Stack>
                    </Toolbar>
                </AppBar>
            </Container >
        </>
    );
}

export default CustomAppBar;
