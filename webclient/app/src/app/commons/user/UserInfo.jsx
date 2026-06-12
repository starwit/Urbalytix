import {IconButton, Tooltip, Typography} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import {useTranslation} from "react-i18next";
import {useEffect, useMemo, useState} from "react";
import UserRest from "../../services/UserRest";
import {useAuth} from "../../security/AuthContext";

export default function UserInfo() {

    const {t, i18n} = useTranslation();
    const auth = useAuth();

    return (
        <>
            <IconButton size="large">
                <Tooltip title={auth?.roles?.join(", ") || t("userInfo.guest")} >
                    <PersonIcon />
                </Tooltip>
            </IconButton >
        </>
    );
}