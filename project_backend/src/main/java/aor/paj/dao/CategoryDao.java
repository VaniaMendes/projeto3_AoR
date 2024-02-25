package aor.paj.dao;

import aor.paj.entity.CategoryEntity;
import aor.paj.entity.TaskEntity;
import jakarta.ejb.Stateless;
import jakarta.persistence.NoResultException;

@Stateless
public class CategoryDao  extends AbstractDao<CategoryEntity> {

    public CategoryDao() {
        super(CategoryEntity.class);
    }


    public CategoryEntity findCategoryById(long id) {
        try {
            return (CategoryEntity) em.createNamedQuery("Category.findCategoryById").setParameter("idCategory", id)
                    .getSingleResult();

        } catch (NoResultException e) {
            return null;
        }
    }

    public CategoryEntity findCategoryByTitle(String title) {
        try {
            return (CategoryEntity) em.createNamedQuery("Category.findCategoryByTitle").setParameter("title", title)
                    .getSingleResult();

        } catch (NoResultException e) {
            return null;
        }

    }
}
