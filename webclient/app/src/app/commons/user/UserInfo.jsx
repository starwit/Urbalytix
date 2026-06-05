import {IconButton, Tooltip, Typography} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import {useTranslation} from "react-i18next";
import {useEffect, useMemo, useState} from "react";
import UserRest from "../../services/UserRest";

export default function UserInfo() {

    const {t, i18n} = useTranslation();
    const [userInfo, setUserInfo] = useState({});

    const userRest = useMemo(() => new UserRest(), []);

    useEffect(() => {
        userRest.getCurrentUserInfo().then(response => {
            if (response.data.authenticated === false) {
                setUserInfo({name: t("userInfo.guest")});
            } else {
                setUserInfo(response.data);
            }
        });
    }, []);

    return (
        <>
            <IconButton size="large">
                <Tooltip title={userInfo.name} >
                    <PersonIcon />
                </Tooltip>
            </IconButton >
        </>
    );
}