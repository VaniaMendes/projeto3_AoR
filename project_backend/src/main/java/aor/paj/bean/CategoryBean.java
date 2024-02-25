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

    public boolean updateCategory(String token, String id, Category category) {

        boolean status;

        UserEntity confirmUser = userDao.findUserByToken(token);
        CategoryEntity categoryToUpdate = categoryDao.findCategoryById(Long.parseLong(id));

        if (confirmUser != null) {
            if (categoryToUpdate != null) {
                categoryToUpdate.setTitle(category.getTitle());
                categoryToUpdate.setDescription(category.getDescription());

                categoryDao.merge(categoryToUpdate);
                status = true;
            } else {
                status = false;
            }
        } else {
            status = false;
        }

        return status;
    }

    public boolean deleteCategory(String token, String id) {
        boolean status;

        UserEntity confirmUser = userDao.findUserByToken(token);
        CategoryEntity categoryToDelete = categoryDao.findCategoryById(Long.parseLong(id));

        if (confirmUser != null) {
            if (categoryToDelete != null) {
                categoryDao.remove(categoryToDelete);
                status = true;
            } else {
                status = false;
            }
        } else {
            status = false;
        }

        return status;
    }

    public boolean isCategoryInUse(String id) {

        CategoryEntity categoryToDelete = categoryDao.findCategoryById(Long.parseLong(id));

        boolean status;
        ArrayList<TaskEntity> findTasksByCategory = taskDao.findTasksByCategory(categoryToDelete);

        if (findTasksByCategory == null) {
            status = false;
        } else {
            status = true;
        }
        return status;
    }

    public boolean isCategoryTitleAvailable(Category category) { //No user estou a passar diretamento o username, aqui passo o objeto todo??

        CategoryEntity categoryEntity = categoryDao.findCategoryByTitle(category.getTitle());

        return categoryEntity == null;
    }

    public boolean isUserAllowedToInteractWithCategories(String token) {

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
