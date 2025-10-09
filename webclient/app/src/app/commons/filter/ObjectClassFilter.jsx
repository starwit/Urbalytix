import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Checkbox,
    FormControl,
    FormControlLabel,
    Typography
} from '@mui/material';
import {useTranslation} from 'react-i18next';

function ObjectClassFilter(props) {
    const {
        objectClasses = [],
        selectedObjectClasses = [],
        onSelectedObjectClassesChange = () => { },
        prefix = 'objectclass'

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
                <Typography component="span">{t(prefix + '.selection')}</Typography><ExpandMoreIcon />
            </AccordionSummary>
            <AccordionDetails>
                <FormControl>
                    {objectClasses.map((objectClass) => (
                        <FormControlLabel
                            key={`object-checkbox-${objectClass}`}
                            control={
                                <Checkbox
                                    key={`object-label-${objectClass}`}
                                    checked={selectedObjectClasses.includes(objectClass)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            onSelectedObjectClassesChange([...selectedObjectClasses, objectClass]);
                                        } else {
                                            onSelectedObjectClassesChange(selectedObjectClasses.filter(s => s !== objectClass));
                                        }
                                    }}
                                    size="small"
                                />
                            }
                            label={t(`${prefix}.${objectClass}`)}
                        />
                    ))}
                </FormControl>

            </AccordionDetails>
        </Accordion>
    );
}

export default ObjectClassFilter;