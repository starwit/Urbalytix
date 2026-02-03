package de.starwit.persistence.entity;

import de.starwit.persistence.enums.ConfigDataTypes;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;

@Entity
@Table(name = "configuration")
public class ConfigurationEntity extends AbstractEntity<Long> {

    @Column(name = "keyname", unique = true, nullable = false, length = 255)
    private String keyname;

    @Column(name = "valuefield", nullable = false, length = 1024)
    private String valuefield;

    @Column(name = "category", nullable = false, length = 255)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(name = "datatype", nullable = false)
    private ConfigDataTypes datatype;

    public String getKeyname() {
        return keyname;
    }

    public void setKeyname(String key) {
        this.keyname = key;
    }

    public String getValuefield() {
        return valuefield;
    }

    public void setValuefield(String value) {
        this.valuefield = value;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public ConfigDataTypes getDatatype() {
        return datatype;
    }

    public void setDatatype(ConfigDataTypes datatype) {
        this.datatype = datatype;
    }

    @Override
    public String toString() {
        return "ConfigurationEntity [id= " + id + ", keyname=" + keyname + ", valuefield=" + valuefield + ", category="
                + category + ", datatype=" + datatype + "]";
    }
}
