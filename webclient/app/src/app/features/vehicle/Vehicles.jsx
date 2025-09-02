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
        <Box sx={{display: 'flex', position: 'absolute', left: 0, top: 55, width: '100%', height: '100%'}}>
            <AppBar color="secondary" position="static" sx={{width: 240, height: '100vh', zIndex: 1000}}>
                <Tabs
                    orientation="vertical"
                    value={selectedTab}
                    onChange={handleTabChange}
                    sx={{borderRight: 1, borderColor: 'divider', '& .MuiTab-root': {justifyContent: 'flex-start', minHeight: 'auto', padding: '8px 16px'}}}
                >
                    <Tab
                        label={
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-start', width: '100%'}}>
                                <FormatListBulletedIcon />
                                <Typography>{t("vehicledata.views.table")}</Typography>
                            </Box>
                        }
                    />
                    <Tab
                        label={
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-start', width: '100%'}}>
                                <TimelineIcon />
                                <Typography>{t("vehicledata.views.routes")}</Typography>
                            </Box>
                        }
                    />
                </Tabs>
            </AppBar>
            <Box sx={{flexGrow: 1, p: 2, position: 'relative', zIndex: 1}}>
                {selectedTab === 0 && <VehicleTable />}
                {selectedTab === 1 && <VehicleRoutes />}
            </Box>
        </Box>
    );
}

export default Vehicles