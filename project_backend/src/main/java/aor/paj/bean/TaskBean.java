package aor.paj.bean;

import java.util.Date;
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

@Singleton
public class TaskBean {

    @EJB
    UserDao userDao;
    @EJB
    TaskDao taskDao;

    @EJB
    CategoryDao categoryDao;

    public TaskBean(){
    }
    public boolean addTask(String token, Task task) {
        UserEntity userEntity = userDao.findUserByToken(token);

        CategoryEntity categoryEntity = categoryDao.findCategoryById(task.getCategory().getIdCategory());

        if(userEntity != null){
            TaskEntity taskEntity = convertTaskToTaskEntity(task);
            taskEntity.setOwner(userEntity);
            taskEntity.setCategory(categoryEntity);
            taskDao.persist(taskEntity);
            return true;
        }
        return false;
    }

    public boolean isTaskTitleAvailable(Task task) { //No user estou a passar diretamento o username, aqui passo o objeto todo??

        TaskEntity taskEntity = taskDao.findTaskByTitle(task.getTitle());

        return taskEntity == null;
    }

    public boolean updateTask(String token, String id, Task task) {

        boolean status;

        UserEntity confirmUser = userDao.findUserByToken(token);
        TaskEntity taskToUpdate = taskDao.findTaskById(Long.parseLong(id));

        if (confirmUser != null) {
            if (taskToUpdate != null) {

                //verifica a função do user e se tem permissão para editar a tarefa
                if (confirmUser.getTypeOfUser().equals("developer") && taskToUpdate.getOwner().equals(confirmUser)
                        || confirmUser.getTypeOfUser().equals("scrum_master")
                        || confirmUser.getTypeOfUser().equals("product_owner")) {

                    taskToUpdate.setTitle(task.getTitle());
                    taskToUpdate.setDescription(task.getDescription());
                    taskToUpdate.setState(task.getState());
                    taskToUpdate.setPriority(task.getPriority());
                    taskToUpdate.setInitialDate(task.getInitialDate());
                    taskToUpdate.setEndDate(task.getEndDate());

                    taskDao.merge(taskToUpdate);
                    status = true;
                } else {
                    status = false;
                }
            } else {
                status = false;
            }
        } else {
            status = false;
        }

        return status;
    }

    public boolean updateTaskState(String token, String id, String newState) {
        boolean status;

        UserEntity confirmUser = userDao.findUserByToken(token);
        TaskEntity taskToUpdate = taskDao.findTaskById(Long.parseLong(id));

        if (confirmUser != null) {
            if (taskToUpdate != null) {
                taskToUpdate.setState(newState);
                taskDao.merge(taskToUpdate);
                status = true;
            } else {
                status = false;
            }
        } else {
            status = false;
        }
        return status;
    }

    public boolean updateTaskCategory(String token, String id, Category category) {
        boolean status;

        UserEntity confirmUser = userDao.findUserByToken(token);
        TaskEntity taskToUpdate = taskDao.findTaskById(Long.parseLong(id));
        CategoryEntity newCategory = categoryDao.findCategoryById(category.getIdCategory());

        if (confirmUser != null) {
            if (taskToUpdate != null) {
                if (newCategory != null) {
                    taskToUpdate.setCategory(convertCategoryToCategoryEntity(category));
                    taskDao.merge(taskToUpdate);
                    status = true;
                } else {
                    status = false;
                }
            } else {
                status = false;
            }
        } else {
            status = false;
        }
        return status;
    }

    private CategoryEntity convertCategoryToCategoryEntity(Category category){

        Date idTime=new Date();
        CategoryEntity categoryEntity = new CategoryEntity();
        categoryEntity.setIdCategory(idTime.getTime());
        categoryEntity.setTitle(category.getTitle());
        categoryEntity.setDescription(category.getDescription());

        return categoryEntity;
    }

    private TaskEntity convertTaskToTaskEntity(Task task){

        Date idTime=new Date();
        TaskEntity taskEntity = new TaskEntity();
        taskEntity.setTitle(task.getTitle());
        taskEntity.setDescription(task.getDescription());
        taskEntity.setId(idTime.getTime());
        taskEntity.setInitialDate(task.getInitialDate());
        taskEntity.setEndDate(task.getEndDate());
        taskEntity.setActive(task.isActive());
        taskEntity.setState("toDo");
        taskEntity.setPriority(100);
        return taskEntity;
    }

}
