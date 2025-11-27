import {
    Box,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip
} from '@mui/material';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';

function DistrictFilter({
    onShowDistrictChange = () => { }
}) {

    const {t} = useTranslation();
    const [selectCityDistricts, setSelectCityDistricts] = useState(false);

    const [showDistricts, setShowDistricts] = useState('');

    return (
        <>
            <Box display="flex" justifyContent="space-between" sx={{alignItems: 'center'}}>
                <ToggleButtonGroup size="small"
                    value={showDistricts}
                    onChange={(event, value) => {
                        onShowDistrictChange(!selectCityDistricts);
                        setSelectCityDistricts(!selectCityDistricts);
                        setShowDistricts(value);
                    }}
                    color='success'
                >
                    <ToggleButton value="districts">
                        <Tooltip title={t("streetData.toggleDistricts")}>
                            <LocationCityIcon />
                        </Tooltip>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
        </>
    )
}

export default DistrictFilter;