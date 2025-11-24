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
import {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {FilterContext} from '../FilterProvider';

function ObjectClassFilter(props) {
    const {
        prefix = 'objectclass'

    } = props;
    const {objectClasses, selectedObjectClasses, setSelectedObjectClasses} = useContext(FilterContext);

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
            <AccordionDetails>
                <FormControl>
                    {objectClasses.map((objectClass) => (
                        <FormControlLabel
                            key={`object-checkbox-${objectClass}`}
                            control={
                                <Checkbox
                                    key={`object-label-${objectClass}`}
                                    checked={selectedObjectClasses?.includes(objectClass) ?? false}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedObjectClasses([...selectedObjectClasses, objectClass]);
                                        } else {
                                            setSelectedObjectClasses(selectedObjectClasses.filter(s => s !== objectClass));
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