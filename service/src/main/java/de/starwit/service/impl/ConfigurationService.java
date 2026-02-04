package de.starwit.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.ConfigurationEntity;
import de.starwit.persistence.enums.ConfigDataTypes;
import de.starwit.persistence.repository.ConfigurationRepository;

@Service
public class ConfigurationService implements ServiceInterface<ConfigurationEntity, ConfigurationRepository> {

    @Autowired
    private ConfigurationRepository repository;

    @Override
    public ConfigurationRepository getRepository() {
        return repository;
    }

    public ConfigurationEntity findByKey(String key) {
        return repository.findByKeyname(key);
    }

    public List<ConfigurationEntity> saveOrUpdateList(List<ConfigurationEntity> configs)
            throws IllegalArgumentException {
        configs.forEach(this::testTypeCorrectness);
        return repository.saveAll(configs);
    }

    @Override
    public ConfigurationEntity saveOrUpdate(ConfigurationEntity config) throws IllegalArgumentException {
        testTypeCorrectness(config);

        ConfigurationEntity existingConfig = repository.findByKeyname(config.getKeyname());
        if (existingConfig != null) {
            existingConfig.setValuefield(config.getValuefield());
            existingConfig.setCategory(config.getCategory());
            existingConfig.setDatatype(config.getDatatype());
            return repository.save(existingConfig);
        } else {
            return repository.save(config);
        }
    }

    private void testTypeCorrectness(ConfigurationEntity config) throws IllegalArgumentException {
        ConfigDataTypes type = config.getDatatype();
        switch (type) {
            case INTEGER:
                try {
                    Integer.parseInt(config.getValuefield());
                } catch (NumberFormatException e) {
                    throw new IllegalArgumentException(
                            "Valuefield for key " + config.getKeyname() + " is not a valid INTEGER.");
                }
                break;
            case DOUBLE:
                try {
                    Double.parseDouble(config.getValuefield());
                } catch (NumberFormatException e) {
                    throw new IllegalArgumentException(
                            "Valuefield for key " + config.getKeyname() + " is not a valid DOUBLE.");
                }
                break;

            case BOOLEAN:
                if (!"true".equalsIgnoreCase(config.getValuefield())
                        && !"false".equalsIgnoreCase(config.getValuefield())) {
                    throw new IllegalArgumentException(
                            "Valuefield for key " + config.getKeyname() + " is not a valid BOOLEAN.");
                }
                break;
            default:
                // String requires no special handling
                break;
        }
    }
}
