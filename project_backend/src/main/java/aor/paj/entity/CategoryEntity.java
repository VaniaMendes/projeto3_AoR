package aor.paj.entity;

import aor.paj.dto.User;
import jakarta.persistence.*;

import java.io.Serializable;
import java.util.Set;

@Entity
@Table(name="category")
@NamedQuery(name = "Category.findCategoryByTitle", query = "SELECT u FROM CategoryEntity u WHERE u.title = :title")
@NamedQuery(name = "Category.findCategoryByUser", query = "SELECT u FROM CategoryEntity u WHERE u.idCategory = :idCategory")
public class CategoryEntity implements Serializable{

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name="idCategory", nullable=false, unique = false, updatable = true)
    private int idCategory;

    @Column(name="title", nullable=false, unique = false, updatable = true)
    private int title;
    @Column(name="description", nullable=false, unique = false, updatable = true)
    private int description;

    @Column(name="username", nullable=false, unique = false, updatable = true)
    private String username;

    @OneToOne
    private CategoryEntity owner;


    //default empty constructor
    public CategoryEntity() {}

    public int getIdCategory() {
        return idCategory;
    }

    public void setIdCategory(int idCategory) {
        this.idCategory = idCategory;
    }

    public int getTitle() {
        return title;
    }

    public void setTitle(int title) {
        this.title = title;
    }

    public int getDescription() {
        return description;
    }

    public void setDescription(int description) {
        this.description = description;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public CategoryEntity getOwner() {
        return owner;
    }

    public void setOwner(CategoryEntity owner) {
        this.owner = owner;
    }
}
