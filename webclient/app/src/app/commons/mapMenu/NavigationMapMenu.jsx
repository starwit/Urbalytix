import NavigationIcon from '@mui/icons-material/Navigation';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import {Divider} from "@mui/material";
import {useTranslation} from "react-i18next";
import StyledToggleButton from './StyledToggleButton';

function NavigationMapMenu(props) {
    const {setViewState} = props;
    const {t} = useTranslation();

    function toggle3dView() {
        setViewState(v => ({
            ...v,
            pitch: v.pitch === 0 ? 60 : 0
        }));
    }

    function setNorth() {
        setViewState(v => ({
            ...v,
            bearing: 0   // set north
        }));
    }

    return (
        <>
            <StyledToggleButton title={t('map.3d')} value="3d" aria-label="3d" onClick={toggle3dView}  >
                <ViewInArIcon variant="contained" />
            </StyledToggleButton>
            <StyledToggleButton title={t('map.nav')} onClick={setNorth} >
                <NavigationIcon />
            </StyledToggleButton>
        </>
    );
}

export default NavigationMapMenu;