import HexagonIcon from '@mui/icons-material/Hexagon';
import RouteIcon from '@mui/icons-material/Route';
import {Box, Paper, ToggleButtonGroup, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import NavigationMapMenu from './NavigationMapMenu';
import StyledToggleButton from './StyledToggleButton';

function CompareMapMenu(props) {
    const {types, handleTypes, setViewState} = props;
    const {t} = useTranslation();

    return (
        <>
            <ToggleButtonGroup size="small"
                sx={{
                    position: 'absolute',
                    right: 10,
                    top: 60,
                    zIndex: 1,
                    gap: 1
                }}
                value={types}
                orientation="vertical"
                onChange={handleTypes}
                color='success'
            >
                <NavigationMapMenu setViewState={setViewState} />

                <StyledToggleButton value="hexcompare" aria-label="hexcompare" title={t('map.hexcompare')}>
                    <HexagonIcon />
                </StyledToggleButton>
                <StyledToggleButton value="coverage" aria-label="coverage" title={t('map.coverageweek')}>
                    <RouteIcon />
                </StyledToggleButton>
            </ToggleButtonGroup >

            <Paper sx={{
                position: 'absolute',
                top: 310,
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