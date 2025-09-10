import {Accordion, AccordionDetails, AccordionSummary, Checkbox, FormControlLabel, FormGroup, Typography} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useTranslation} from 'react-i18next';



function VehicleFilter(props) {
    const {vehicleData,
        selectedVehicleData = [],
        onSelectedVehicleDataChange = () => { },
    } = props;

    const {t} = useTranslation();

    return (
        <>
            <Accordion defaultExpanded={true} disableGutters>
                <AccordionSummary
                    sx={{
                        backgroundColor: theme => theme.palette.secondary.main,
                    }}
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography component="span">{t('vehicledata.selectvehicle')}</Typography>
                </AccordionSummary>
                <AccordionDetails >
                    <FormGroup aria-label={t('vehicledata.selection')}>
                        {vehicleData.map(({id, name, streamKey}) => (
                            <FormControlLabel
                                key={`vehicle-label-${streamKey}`}
                                control={
                                    <Checkbox
                                        key={`vehicle-checkbox-${streamKey}`}
                                        checked={selectedVehicleData.includes(streamKey)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                onSelectedVehicleDataChange([...selectedVehicleData, streamKey]);
                                            } else {
                                                onSelectedVehicleDataChange(selectedVehicleData.filter(s => s !== streamKey));
                                            }
                                        }}
                                        size="small"
                                    />
                                }
                                label={t(`vehicledata.${name.toLowerCase()}`)}
                            />
                        ))}
                    </FormGroup>
                </AccordionDetails>
            </Accordion>
        </>
    );
}

export default VehicleFilter;