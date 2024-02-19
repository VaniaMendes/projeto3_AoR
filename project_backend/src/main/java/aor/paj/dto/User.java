package aor.paj.dto;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

import java.io.Serializable;
import java.util.ArrayList;

@XmlRootElement
public class User{
    @XmlElement
    private String username;
    @XmlElement
    private String password;
    @XmlElement
    private String email;
    @XmlElement
    private String firstName;
    @XmlElement
    private String lastName;
    @XmlElement
    private String phoneNumber;
    @XmlElement
    private String imgURL;
    @XmlElement
    private ArrayList<Task> tasks;
    @XmlElement
    private String toDo_color;

    @XmlElement
    private String doing_color;

    @XmlElement
    private String done_color;

    @XmlElement
    private String background_color;


    public User(){
        this.username=null;
        this.password=null;
        this.email=null;
        this.firstName=null;
        this.lastName=null;
        this.phoneNumber=null;
        this.imgURL=null;
        this.tasks=new ArrayList<>();
        this.toDo_color="#f1f2f4";
        this.doing_color="#f1f2f4";
        this.done_color="#f1f2f4";
        this.background_color="#172b4c";
    }


    public ArrayList<Task> getTasks() {
        return tasks;
    }

    public void setTasks(ArrayList<Task> tasks) {
        this.tasks = tasks;
    }

    public String getToDo_color() {
        return toDo_color;
    }

    public void setToDo_color(String toDo_color) {this.toDo_color = toDo_color;}

    public String getDoing_color() {
        return doing_color;
    }

    public void setDoing_color(String doing_color) {
        this.doing_color = doing_color;
    }

    public String getDone_color() {
        return done_color;
    }

    public void setDone_color(String done_color) {
        this.done_color = done_color;
    }

    public String getBackground_color() {
        return background_color;
    }

    public void setBackground_color() {
        this.background_color = "#172b4c";
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getImgURL() {
        return imgURL;
    }

    public void setImgURL(String imgURL) {
        this.imgURL = imgURL;
    }

    public void addTask(Task task){
        tasks.add(task);
    }

    public void changeBackground_color(String background_color) {
        this.background_color =background_color;
    }

    public void changeToDo_color(String toDo_color) {this.toDo_color = toDo_color;}

    public void changeDoing_color(String doing_color) {
        this.doing_color = doing_color;
    }

    public void changeDone_color(String done_color) {
        this.done_color = done_color;
    }
}

