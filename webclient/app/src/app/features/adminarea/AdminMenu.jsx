import {Box, ClickAwayListener, Grow, IconButton, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Popper, Tooltip} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import EditRoadIcon from '@mui/icons-material/EditRoad';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";

function AdminMenu(props) {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const {t} = useTranslation();
    const prevOpen = useRef(open);

    useEffect(function () {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    function handleToggle() {
        setOpen((prevOpen) => !prevOpen);
    };

    function handleClose(event) {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    }

    return (
        <>
            <Tooltip title={t("menu.config")}>
                <Box>
                    <IconButton
                        size="large"
                        onClick={handleToggle}
                        ref={anchorRef}
                        variant="outlined">
                        <SettingsIcon />
                    </IconButton>
                </Box>
            </Tooltip>

            <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="bottom-start"
                transition
                disablePortal
            >
                {({TransitionProps, placement}) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom-start' ? 'left top' : 'left bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList
                                    autoFocusItem={open}
                                    id="admin-menu"
                                    aria-labelledby="admin-button"
                                    onKeyDown={handleListKeyDown}
                                >
                                    <MenuItem component={Link} to={"/vehicles"} onClick={handleClose}>
                                        <ListItemIcon><LocalShippingIcon fontSize="small" /></ListItemIcon>
                                        <ListItemText>{t("menu.config.vehicles")}</ListItemText>
                                    </MenuItem>
                                    <MenuItem component={Link} to={"/streetcatalog"} onClick={handleClose}>
                                        <ListItemIcon><EditRoadIcon fontSize="small" /></ListItemIcon>
                                        <ListItemText>{t("menu.config.road")}</ListItemText>
                                    </MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    );
}

export default AdminMenu;