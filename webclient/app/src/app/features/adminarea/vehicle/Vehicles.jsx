import {useState} from "react";
import {Typography, AppBar, Tabs, Tab, Box} from "@mui/material";

import {useTranslation} from "react-i18next";
import {deDE, enUS} from '@mui/x-data-grid/locales';

import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TimelineIcon from '@mui/icons-material/Timeline';

import VehicleTable from "./VehicleTable";
import VehicleRoutes from "./VehicleRoutes";

function Vehicles() {
    const {t, i18n} = useTranslation();
    const locale = i18n.language == "de" ? deDE : enUS;
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <VehicleRoutes />
    );
}

export default Vehicles