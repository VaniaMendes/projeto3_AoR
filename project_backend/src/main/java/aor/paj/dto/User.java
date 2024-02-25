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
    private String token;
    @XmlElement
    private boolean isActive;
    @XmlElement
    private String typeOfUSer;
    @XmlElement
    private ArrayList<Task> tasks;



    public User(){
        this.username=null;
        this.password=null;
        this.email=null;
        this.firstName=null;
        this.lastName=null;
        this.phoneNumber=null;
        this.imgURL=null;
        this.tasks=new ArrayList<>();
        this.isActive=true;
        this.typeOfUSer = "ProductOwner";

    }


    public ArrayList<Task> getTasks() {
        return tasks;
    }

    public void setTasks(ArrayList<Task> tasks) {
        this.tasks = tasks;
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

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void addTask(Task task){
        tasks.add(task);
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public String getTypeOfUSer() {
        return typeOfUSer;
    }

    public void setTypeOfUSer(String typeOfUSer) {
        this.typeOfUSer = typeOfUSer;
    }
}

