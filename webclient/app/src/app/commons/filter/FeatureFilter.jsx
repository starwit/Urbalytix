import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Checkbox,
    Divider,
    FormControlLabel,
    FormGroup,
    Typography
} from '@mui/material';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';

function FeatureFilter({
    availableFeatureKeys = [],
    selectedFeatureKeys = [],
    onSelectedFeatureChange = () => { },
    label = 'features.selection'
}) {

    const {t} = useTranslation();
    const [selectAllFeatures, setSelectAllFeatures] = useState(false);

    const featureItems = availableFeatureKeys.map((item, index) => ({
        id: index + 1,   // or you could use item itself if you prefer
        name: item
    }));

    return (

        <Accordion defaultExpanded={true} disableGutters>
            <AccordionSummary
                sx={{
                    backgroundColor: theme => theme.palette.secondary.main,
                }}
                expandIcon={<ExpandMoreIcon />}
            >
                <Typography component="span">{t(label)}</Typography>

            </AccordionSummary>
            <AccordionDetails >
                <FormGroup aria-label={t(label)}>
                    <FormControlLabel
                        key={`state-label-all`}
                        control={
                            <Checkbox
                                checked={selectAllFeatures}
                                size="small"
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        onSelectedFeatureChange(availableFeatureKeys);
                                    } else {
                                        onSelectedFeatureChange([]);
                                    }
                                    setSelectAllFeatures(!selectAllFeatures);
                                }}
                            />}
                        label={t('features.selection.all')}

                    />
                    <Divider />
                    {featureItems.map(({id, name}) => (
                        <FormControlLabel
                            key={`feature-label-${id}`}
                            control={
                                <Checkbox
                                    key={`state-checkbox-${id}`}
                                    checked={selectedFeatureKeys.includes(name)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            onSelectedFeatureChange([...selectedFeatureKeys, name]);
                                        } else {
                                            onSelectedFeatureChange(selectedFeatureKeys.filter(s => s !== name));
                                        }
                                    }}
                                    size="small"
                                />
                            }
                            label={t(`feature.${name.toLowerCase()}`)}
                        />
                    ))}
                </FormGroup>
            </AccordionDetails>
        </Accordion>

    );
}

export default FeatureFilter;