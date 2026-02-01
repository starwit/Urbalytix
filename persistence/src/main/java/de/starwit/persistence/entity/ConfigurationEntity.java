package de.starwit.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
}
