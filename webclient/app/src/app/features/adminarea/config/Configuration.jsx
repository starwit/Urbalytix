import {useEffect, useMemo, useState} from 'react';
import {Button, TextField} from '@mui/material';
import SaveIcon from "@mui/icons-material/Save";
import ConfigurationRest from '../../../services/ConfigurationRest';
import {useTranslation} from 'react-i18next';
import {deDE, enUS} from '@mui/x-data-grid/locales';

function Configuration() {
    const {t, i18n} = useTranslation();
    const locale = i18n.language == "de" ? deDE : enUS;
    const configurationRest = useMemo(() => new ConfigurationRest(), []);
    const [configurations, setConfigurations] = useState([]);
    const [isSaved, setIsSaved] = useState([true]);

    useEffect(() => {
        loadConfigurations();
    }, []);

    function loadConfigurations() {
        configurationRest.getAllConfigurations().then(response => {
            setConfigurations(response.data);
        });
    }

    function handleValueChange(id, newValue, category) {
        setConfigurations(prev =>
            prev.map(config =>
                config.id === id ? {...config, valuefield: newValue} : config
            )
        );
        setIsSaved(false);
    }

    function saveConfig() {
        configurationRest.setConfiguration(configurations).then(response => {
            setConfigurations(response.data);
        });
        setIsSaved(true);
    }

    const configsByCategory = useMemo(() => {
        return configurations.reduce((acc, config) => {
            if (!acc[config.category]) {
                acc[config.category] = [];
            }
            acc[config.category].push(config);
            return acc;
        }, {});
    }, [configurations]);

    const sortedConfigsByCategory = useMemo(() => {
        const sorted = {};
        Object.keys(configsByCategory).forEach(category => {
            sorted[category] = configsByCategory[category].sort((a, b) => 
                a.keyname.localeCompare(b.keyname)
            );
        });
        return sorted;
    }, [configsByCategory]);

    return <>
        {Object.entries(sortedConfigsByCategory).map(([category, configs]) => (
            <div key={category}>
                <h2>{t(`config.category.${category}`)}</h2>
                {configs.map(config => (
                    <div key={config.id} style={{marginBottom: '16px'}}>
                        <TextField
                            label={t(`config.item.${config.keyname}`)}
                            value={config.valuefield}
                            onChange={(e) => handleValueChange(config.id, e.target.value, category)}
                            fullWidth
                        />
                    </div>
                ))}
            </div>
        ))}
        <Button variant="contained" color="primary" onClick={saveConfig} startIcon={<SaveIcon />}>
            {t("config.save")} {isSaved ? "" : "*"}
        </Button>
    </>
}

export default Configuration;