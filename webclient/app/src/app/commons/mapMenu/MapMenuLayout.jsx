import {ToggleButtonGroup} from "@mui/material";
import {useTranslation} from "react-i18next";

function MapMenuLayout(props) {
    const {children, value, onChange} = props;
    const {t} = useTranslation();

    return (
        <ToggleButtonGroup size='small'
            sx={{
                position: 'fixed',
                right: 10,
                top: 60,
                zIndex: 1,
                gap: 1
            }}
            value={value}
            orientation="vertical"
            onChange={onChange}
            color='success'
        >
            {children}
        </ToggleButtonGroup>
    );
}

export default MapMenuLayout;