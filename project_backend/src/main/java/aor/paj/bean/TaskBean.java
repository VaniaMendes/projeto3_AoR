package aor.paj.bean;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.Date;

import aor.paj.dao.TaskDao;
import aor.paj.dao.UserDao;
import aor.paj.dto.Task;
import aor.paj.dto.User;
import aor.paj.entity.TaskEntity;
import aor.paj.entity.UserEntity;
import jakarta.ejb.EJB;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.json.bind.JsonbConfig;

@ApplicationScoped
public class TaskBean {

    final String filename = "tasks.json";
    private ArrayList<Task> tasks;

    @EJB
    UserDao userDao;
    @EJB
    TaskDao taskDao;

    public TaskBean(){
    }
    public boolean addTask(String token, Task task) {
        UserEntity userEntity = userDao.findUserByToken(token);
        if(userEntity != null){
            TaskEntity taskEntity = convertTaskToTaskEntity(task);
            taskEntity.setOwner(userEntity);
            taskDao.persist(taskEntity);
            return true;
        }
        return false;
    }

    public boolean updateTask(String token, String id, Task task) {

        boolean status;

        UserEntity confirmUser = userDao.findUserByToken(token);
        TaskEntity taskToUpdate = taskDao.findTaskById(Long.parseLong(id));

        if (confirmUser != null) {
            if (taskToUpdate != null) {

                taskToUpdate.setTitle(task.getTitle());
                taskToUpdate.setDescription(task.getDescription());
                taskToUpdate.setState(task.getState());
                taskToUpdate.setPriority(task.getPriority());
                taskToUpdate.setInitialDate(task.getInitialDate());
                taskToUpdate.setEndDate(task.getEndDate());


                status = true;
            } else {
                status = false;
            }
        } else {
            status = false;
        }

        return status;
    }

    private TaskEntity convertTaskToTaskEntity(Task task){

        Date idTime=new Date();
        TaskEntity taskEntity = new TaskEntity();
        taskEntity.setTitle(task.getTitle());
        taskEntity.setDescription(task.getDescription());
        taskEntity.setId(idTime.getTime());
        taskEntity.setInitialDate(task.getInitialDate());
        taskEntity.setEndDate(task.getEndDate());
        taskEntity.setState("toDo");
        taskEntity.setPriority(0);
        return taskEntity;
    }

    public Task getTask(int id){
        Task taskRequested=null;
        for (int i=0;i<tasks.size() && taskRequested==null;i++){
            if (tasks.get(i).getId()==id){
                taskRequested=tasks.get(i);
            }
        }
        return taskRequested;
    }
    public ArrayList<Task> getTasks() {
        return tasks;
    }



    public boolean oldUpdateTask(int id, Task task) {
        for (Task a : tasks) {
            if (a.getId() == id) {
                a.setTitle(task.getTitle());
                a.setDescription(task.getDescription());
                writeIntoJsonFile();
                return true;
            }
        }
        return false;
    }

    private void writeIntoJsonFile(){
        try {
            FileOutputStream fileOutputStream = new FileOutputStream(filename);
            JsonbConfig config = new JsonbConfig().withFormatting(true);
            Jsonb jsonb = JsonbBuilder.create(config);
            jsonb.toJson(tasks, fileOutputStream);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
    }
}
