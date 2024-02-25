package aor.paj.bean;

import aor.paj.dao.CategoryDao;
import aor.paj.dao.TaskDao;
import aor.paj.dao.UserDao;
import aor.paj.dto.Category;
import aor.paj.dto.Task;
import aor.paj.entity.CategoryEntity;
import aor.paj.entity.TaskEntity;
import aor.paj.entity.UserEntity;
import jakarta.ejb.EJB;
import jakarta.ejb.Singleton;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.ArrayList;
import java.util.Date;

@Singleton
public class CategoryBean {


    @EJB
    UserDao userDao;
    @EJB
    TaskDao taskDao;
    @EJB
    CategoryDao categoryDao;

    public CategoryBean(){
    }

    public boolean addCategory(String token, Category category) {
        UserEntity userEntity = userDao.findUserByToken(token);

        if(userEntity != null && userEntity.getTypeOfUser().equals("product_owner")){

            CategoryEntity categoryEntity = convertCategoryToCategoryEntity(category);
            categoryEntity.setOwner(userEntity);
            categoryDao.persist(categoryEntity);
            return true;
        }
        return false;
    }

    public boolean isCategoryTitleAvailable(Category category) { //No user estou a passar diretamento o username, aqui passo o objeto todo??

        CategoryEntity categoryEntity = categoryDao.findCategoryByTitle(category.getTitle());

        return categoryEntity == null;
    }

    public boolean isUserAllowedToCreateCategories (String token) {

        UserEntity userEntity = userDao.findUserByToken(token);

        if (userEntity == null || !userEntity.getTypeOfUser().equals("product_owner")) {
            return false;
        }
        return true;
    }

    private CategoryEntity convertCategoryToCategoryEntity(Category category){

        Date idTime=new Date();
        CategoryEntity categoryEntity = new CategoryEntity();
        categoryEntity.setIdCategory(idTime.getTime());
        categoryEntity.setTitle(category.getTitle());
        categoryEntity.setDescription(category.getDescription());

        return categoryEntity;
    }
}
