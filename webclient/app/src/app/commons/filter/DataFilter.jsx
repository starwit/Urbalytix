import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Typography
} from '@mui/material';
import {useTranslation} from 'react-i18next';

function DataFilter(props) {
    const {
        selectedFilterLabels = [],
        onSelectedFilterLabels = () => { },
        filters = [],
        prefix = 'data'

    } = props;
    const {t} = useTranslation();

    return (
        <Accordion defaultExpanded={true} disableGutters>
            <AccordionSummary
                sx={{
                    backgroundColor: theme => theme.palette.secondary.main,
                }}
                expandIcon={<ExpandMoreIcon />}
            >
                <Typography component="span">{t(prefix + '.selection')}</Typography>
            </AccordionSummary>
            <AccordionDetails >
                <FormGroup title={t(prefix + '.selection')}>
                    {filters.map(({value, label}) => (
                        <FormControlLabel
                            key={prefix + `data-label-${value}`}
                            control={
                                <Checkbox
                                    key={`state-checkbox-${value}`}
                                    checked={selectedFilterLabels.includes(label)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            onSelectedFilterLabels([...selectedFilterLabels, label]);
                                        } else {
                                            onSelectedFilterLabels(selectedFilterLabels.filter(s => s !== label));
                                        }
                                    }}
                                    size="small"
                                />
                            }
                            label={t(prefix + `.${label.toLowerCase()}`)}
                        />
                    ))}
                </FormGroup>
            </AccordionDetails>
        </Accordion>
    );
}

export default DataFilter;