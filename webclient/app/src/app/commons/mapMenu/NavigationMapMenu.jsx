import LocationCityIcon from '@mui/icons-material/LocationCity';
import NavigationIcon from '@mui/icons-material/Navigation';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import {Box} from '@mui/material';
import {useTranslation} from "react-i18next";
import StyledToggleButton from './StyledToggleButton';
import {useContext} from 'react';
import {FilterContext} from '../FilterProvider';

function NavigationMapMenu(props) {
    const {setViewState, setShowDistricts} = props;
    const {types} = useContext(FilterContext);
    const {t} = useTranslation();

    function toggle3dView() {
        if (types.includes("3d")) {
            setViewState(v => ({
                ...v,
                pitch: 0
            }));
        } else {
            setViewState(v => ({
                ...v,
                pitch: 60
            }));
        }
    }

    function setNorth() {
        setViewState(v => ({
            ...v,
            bearing: 0   // set north
        }));
    }

    function toggleShowDistricts() {
        setShowDistricts(d => (!d));
    }

    return (
        <>
            <StyledToggleButton title={t('map.3d')} value="3d" aria-label="3d" onClick={toggle3dView}  >
                <ViewInArIcon variant="contained" />
            </StyledToggleButton>
            <StyledToggleButton title={t('map.nav')} onClick={setNorth} >
                <NavigationIcon />
            </StyledToggleButton>
            <StyledToggleButton value='districts' onClick={toggleShowDistricts} aria-label="districts">
                <LocationCityIcon />
            </StyledToggleButton>
            <Box sx={{paddingBottom: 5}} />
        </>
    );
}

export default NavigationMapMenu;