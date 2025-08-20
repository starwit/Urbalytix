package de.starwit.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "objectclass")
public class ObjectClassEntity extends AbstractEntity<Long> {

    @Column(name = "class_id")
    private Integer classId;

    @Column(name = "name")
    private String name;

    @Column(name = "category")
    private String category;

    public Integer getClassId() {
        return classId;
    }

    public void setClassId(Integer classId) {
        this.classId = classId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}