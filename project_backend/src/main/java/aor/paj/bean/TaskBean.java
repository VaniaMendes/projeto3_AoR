package aor.paj.bean;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.util.ArrayList;

import aor.paj.dto.Task;
import aor.paj.dto.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.json.bind.JsonbConfig;

@ApplicationScoped
public class TaskBean {

    final String filename = "tasks.json";
    private ArrayList<Task> tasks;

    public TaskBean(){
        File f = new File(filename);
        if(f.exists()){
            try {
                FileReader filereader = new FileReader(f);
                tasks = JsonbBuilder.create().fromJson(filereader, new
                        ArrayList<User>() {}.getClass().getGenericSuperclass());
            } catch (FileNotFoundException e) {
                throw new RuntimeException(e);
            }
        }else
            tasks = new ArrayList<Task>();

    }
    public void addTask(Task a) {
        tasks.add(a);
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



    public boolean updateTask(int id, Task task) {
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
