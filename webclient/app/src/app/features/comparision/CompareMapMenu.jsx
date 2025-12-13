import HexagonIcon from '@mui/icons-material/Hexagon';
import RouteIcon from '@mui/icons-material/Route';
import {Box, Paper, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import MapMenuLayout from '../../commons/mapMenu/MapMenuLayout';
import NavigationMapMenu from '../../commons/mapMenu/NavigationMapMenu';
import StyledToggleButton from '../../commons/mapMenu/StyledToggleButton';

function CompareMapMenu(props) {
    const {types, handleTypes, setViewState, setShowDistricts} = props;
    const {t} = useTranslation();

    return (
        <>
            <MapMenuLayout
                value={types}
                onChange={handleTypes}
            >
                <NavigationMapMenu setViewState={setViewState} setShowDistricts={setShowDistricts} />

                <StyledToggleButton value="hexagon" aria-label="hexagon" title={t('map.hexcompare')}>
                    <HexagonIcon />
                </StyledToggleButton>
                <StyledToggleButton value="coverage" aria-label="coverage" title={t('map.coverageweek')}>
                    <RouteIcon />
                </StyledToggleButton>
            </MapMenuLayout>
            <Paper sx={{
                position: 'fixed',
                top: 360,
                right: 10,
                zIndex: 1,
                padding: 1
            }}>
                <Typography variant='subtitle2'>{t('map.legend')}</Typography>
                <Box sx={{paddingTop: 1, display: 'flex', alignItems: 'center'}}>
                    <HexagonIcon color="info" /><Typography variant='caption'>{t('legend.selected')}</Typography>
                </Box>
                <Box sx={{paddingBottom: 1, display: 'flex', alignItems: 'center'}}>
                    <HexagonIcon color="disabled" /><Typography variant='caption'>{t('legend.before')}</Typography>
                </Box>

            </Paper>


        </>
    );
}

export default CompareMapMenu;