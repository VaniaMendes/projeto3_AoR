package aor.paj.bean;

import java.util.ArrayList;
import java.util.Date;
import aor.paj.dao.CategoryDao;
import aor.paj.dao.TaskDao;
import aor.paj.dao.UserDao;
import aor.paj.dto.Category;
import aor.paj.dto.Task;
import aor.paj.dto.User;
import aor.paj.entity.CategoryEntity;
import aor.paj.entity.TaskEntity;
import aor.paj.entity.UserEntity;
import jakarta.ejb.EJB;
import jakarta.ejb.Singleton;
import jakarta.inject.Inject;

@Singleton
public class TaskBean {

    @EJB
    UserDao userDao;
    @EJB
    TaskDao taskDao;

    @EJB
    CategoryDao categoryDao;

    @Inject
    UserBean userBean;
    @Inject
    CategoryBean categoryBean;

    public TaskBean(){
    }
    public boolean addTask(String token, Task task, String categoryId) {
        UserEntity userEntity = userDao.findUserByToken(token);

        CategoryEntity categoryEntity = categoryDao.findCategoryById(Long.parseLong(categoryId));

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

    public boolean isTaskTitleAvailableToUpdate(String token, String taskId) {

        UserEntity userEntity = userDao.findUserByToken(token);
        TaskEntity taskEntity = taskDao.findTaskByTitle(taskId);

        if (userEntity != null) {
            if (taskEntity != null) {
                return taskEntity.getOwner().equals(userEntity);
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    public boolean updateTask(String token, String taskId, Task task, String categoryId) {

        boolean status;

        UserEntity confirmUser = userDao.findUserByToken(token);
        TaskEntity taskToUpdate = taskDao.findTaskById(Long.parseLong(taskId));
        CategoryEntity newCategory = categoryDao.findCategoryById(Long.parseLong(categoryId));

        if (confirmUser != null) {
            if (taskToUpdate != null) {
                if (newCategory != null) {

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
                        taskToUpdate.setCategory(newCategory);

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

    public boolean updateTaskActiveState(String token, String id) {
        boolean status;

        UserEntity confirmUser = userDao.findUserByToken(token);
        TaskEntity taskToUpdate = taskDao.findTaskById(Long.parseLong(id));


        if (confirmUser != null) {
            if (taskToUpdate != null) {

                if(taskToUpdate.isActive()) {
                    taskToUpdate.setActive(false);
                } else {
                    taskToUpdate.setActive(true);
                }


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

    public boolean deleteTasksByUsername(String username) {
        boolean status;

        UserEntity confirmUser = userDao.findUserByUsername(username);
        ArrayList<TaskEntity> tasksToDelete = taskDao.findTasksByUser(confirmUser);

        if (confirmUser != null) {
            if (tasksToDelete != null) {
                for (TaskEntity taskEntity : tasksToDelete) {
                    taskEntity.setActive(false);
                }
                status = true;
            } else {
                status = false;
            }
        } else {
            status = false;
        }

        return status;
    }

    public boolean hardDeleteTask(String token, String id) {
        boolean status;

        UserEntity confirmUser = userDao.findUserByToken(token);
        TaskEntity taskToDelete = taskDao.findTaskById(Long.parseLong(id));

        if (confirmUser != null) {
            if (taskToDelete != null) {
                taskDao.remove(taskToDelete);
                status = true;
            } else {
                status = false;
            }
        } else {
            status = false;
        }

        return status;
    }

    public ArrayList<Task> getSoftDeletedTasks() {

        ArrayList<TaskEntity> softDeletedTasksEntities = taskDao.findSoftDeletedTasks();
        ArrayList<Task> softDeletedTasks = new ArrayList<>();

        if (softDeletedTasksEntities == null) {
            return new ArrayList<>();
        } else {
            for (TaskEntity taskEntity : softDeletedTasksEntities) {
                Task task = convertTaskEntityToTask(taskEntity);
                softDeletedTasks.add(task);
            }
        }

        return softDeletedTasks;
    }


    //passar estes dois métodos para o CategoryBean e chamar categoryBean aqui?
    private CategoryEntity convertCategoryToCategoryEntity(Category category){

        Date idTime=new Date();
        CategoryEntity categoryEntity = new CategoryEntity();
        categoryEntity.setIdCategory(idTime.getTime());
        categoryEntity.setTitle(category.getTitle());
        categoryEntity.setDescription(category.getDescription());

        return categoryEntity;
    }

    private Category convertCategoryEntityToCategoryForTask(CategoryEntity categoryEntity){


        Category category = new Category();

        category.setTitle(categoryEntity.getTitle());


        return category;
    }

    private Task convertTaskEntityToTask(TaskEntity taskEntity){

        Task task = new Task();

        task.setTitle(taskEntity.getTitle());
        task.setDescription(taskEntity.getDescription());
        task.setId(taskEntity.getId());
        task.setInitialDate(taskEntity.getInitialDate());
        task.setEndDate(taskEntity.getEndDate());
        task.setPriority(taskEntity.getPriority());
        task.setState(taskEntity.getState());
        task.setActive(taskEntity.isActive());
        task.setAuthor(userBean.convertUserEntityToDtoForTask(taskEntity.getOwner()));
        task.setCategory(convertCategoryEntityToCategoryForTask(taskEntity.getCategory()));

        return task;
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
        taskEntity.setPriority(task.getPriority());
        return taskEntity;
    }


    public ArrayList<Task> getAllTasks(String token) {

            UserEntity userEntity = userDao.findUserByToken(token);
            ArrayList<TaskEntity> allTasksEntities = taskDao.findAllTasks();

            ArrayList<Task> allTasks = new ArrayList<>();

            if (userEntity != null) {
                if (allTasksEntities != null) {
                    for (TaskEntity taskEntity : allTasksEntities) {
                        Task task = convertTaskEntityToTask(taskEntity);
                        allTasks.add(task);
                    }
                }
            }

            return allTasks;
    }


    public ArrayList<Task> getActiveTasks(String token) {

            UserEntity userEntity = userDao.findUserByToken(token);
            ArrayList<TaskEntity> activeTasksEntities = taskDao.findActiveTasks();

            ArrayList<Task> activeTasks = new ArrayList<>();

            if (userEntity != null) {
                if (activeTasksEntities != null) {
                    for (TaskEntity taskEntity : activeTasksEntities) {
                        Task task = convertTaskEntityToTask(taskEntity);
                        activeTasks.add(task);
                    }
                }
            }

            return activeTasks;
    }

    public Task getTaskById(String token, String id) {

            UserEntity userEntity = userDao.findUserByToken(token);
            TaskEntity taskEntity = taskDao.findTaskById(Long.parseLong(id));

            Task task = new Task();

            if (userEntity != null) {
                if (taskEntity != null) {
                    task = convertTaskEntityToTask(taskEntity);
                }
            }

            return task;
    }


    public ArrayList<Task> getFilterTasks(String token, String username, long categoryId) {
        ArrayList<Task> allTasks = new ArrayList<>();
        UserEntity userEntity = userDao.findUserByToken(token);

        if (userEntity == null || (!userEntity.getTypeOfUser().equals("product_owner") && !userEntity.getTypeOfUser().equals("scrum_master"))) {
            return null;
        }



        if (username != null || categoryId != 0) {
            UserEntity userEntity1 = userDao.findUserByUsername(username);
            CategoryEntity categoryEntity = categoryDao.findCategoryById(categoryId);

            ArrayList<TaskEntity> allTasksEntities = taskDao.findFilterTasks(userEntity1, categoryEntity);

            if (allTasksEntities != null) {
                for (TaskEntity taskEntity : allTasksEntities) {

                    //Filtro para selecionar as tasks ativas
                    if (taskEntity.isActive()) {
                        // Filtro para selecionar os usuários ativos
                        if (taskEntity.getOwner().getIsActive()) {
                            Task task = convertTaskEntityToTask(taskEntity);
                            allTasks.add(task);
                        }
                    }
                }
            }
        }
            return allTasks;
        }


    public ArrayList<Task> getTasksByUsername(String token, String username) {

        UserEntity userEntity = userDao.findUserByToken(token);
        UserEntity userToHaveTasksDeleted = userDao.findUserByUsername(username);
        ArrayList<TaskEntity> tasksByUsernameEntities = taskDao.findTasksByUser(userToHaveTasksDeleted);

        ArrayList<Task> tasksByUsername = new ArrayList<>();

            if (userEntity != null) {
                if (tasksByUsernameEntities != null) {
                    if (userToHaveTasksDeleted != null) {
                        for (TaskEntity taskEntity : tasksByUsernameEntities) {
                            Task task = convertTaskEntityToTask(taskEntity);
                            tasksByUsername.add(task);
                        }
                    }
                }
            }
        return tasksByUsername;
    }

}
