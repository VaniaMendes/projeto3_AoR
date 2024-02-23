package aor.paj.bean;

import aor.paj.dao.UserDao;
import aor.paj.dto.LoginDto;
import aor.paj.dto.Task;
import aor.paj.dto.User;
import aor.paj.dto.UserDetails;
import aor.paj.entity.UserEntity;
import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.json.bind.JsonbConfig;
import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;

import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Stateless
public class UserBean implements Serializable {

    @EJB
    UserDao userDao;

    ArrayList<User>users;


    public UserBean(){
    }
    //Método para adicionar um user novo ao json
    public boolean addUser(User user) {

        UserEntity userFromDb = userDao.findUserByUsername(user.getUsername());
        if (userFromDb == null) {
            userDao.persist(convertUserDtotoUserEntity(user));
            return true;
        } else {
            return false;
        }
    }

    public String loginDB(LoginDto user){
        UserEntity userEntity = userDao.findUserByUsername(user.getUsername());
        if (userEntity != null){
            if (userEntity.getPassword().equals(user.getPassword())){
                String token = generateNewToken();
                userEntity.setToken(token);
                return token;
            }
        }
        return null;
    }
    private String generateNewToken() {
        SecureRandom secureRandom = new SecureRandom();
        Base64.Encoder base64Encoder = Base64.getUrlEncoder();
        byte[] randomBytes = new byte[24];
        secureRandom.nextBytes(randomBytes);
        return base64Encoder.encodeToString(randomBytes);
    }

    private UserEntity convertUserDtotoUserEntity(User user){
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(user.getUsername());
        userEntity.setPassword(user.getPassword());
        userEntity.setToken(user.getToken());
        userEntity.setEmail(user.getEmail());
        userEntity.setPhoneNumber(user.getPhoneNumber());
        userEntity.setImgURL(user.getImgURL());
        userEntity.setFirstName(user.getFirstName());
        userEntity.setLastName(user.getLastName());
        userEntity.setIsActive(false);
        userEntity.setTypeOfUser("developer");

        return userEntity;
    }
/*
    public String login(User user){
        UserEntity userEntity = userDao.fin(user.getEmail());
        if (userEntity != null){
            if (userEntity.getPassword().equals(user.getPassword())){
                String token = generateNewToken();
                userEntity.setToken(token);
                return token;
            }
        }
        return null;
    }


    */

    public boolean register(User user){
        UserEntity u= userDao.findUserByUsername(user.getUsername());
        if (u==null){
            userDao.persist(convertUserDtotoUserEntity(user));
            return true;
        }else
            return false;
    }

    //Método para adicionar uma task nova a um user
    public void addTask(User user, Task task){
        user.getTasks().add(task);

    }
    //Método para eliminar uma task
    public boolean removeTask(User user,long id) {
        boolean taskRemoved=false;
        ArrayList<Task> tasksRequested=user.getTasks();
        for (int i=0;i<tasksRequested.size() && !taskRemoved;i++) {
            if (tasksRequested.get(i).getId() == id) {
                tasksRequested.remove(i);
                taskRemoved=true;
            }
        }

        return taskRemoved;
    }

    //getter de uma task a partir do seu id
    public Task getTask(User user, long id){
        Task taskRequested=null;
        ArrayList<Task> tasksUser=user.getTasks();
        System.out.println(user.getUsername());
        for (int i=0;i<tasksUser.size() && taskRequested==null;i++){

            if (tasksUser.get(i).getId()==id){
                taskRequested=tasksUser.get(i);
            }
        }
        System.out.println(taskRequested);
        return taskRequested;
    }

    //faz o update do estado da task que recebe como input
    public void updateTaskState(Task task, String state){
        task.changeState(state);

    }

    //faz o update dos atributos da task que recebe como input
    public void updateTask(Task task, String title, String description, LocalDate initialDate, LocalDate endDate,
                           int priority){
        task.setTitle(title);
        task.setDescription(description);
        task.setInitialDate(initialDate);
        task.setEndDate(endDate);
        task.setPriority(priority);

    }

    //Método em que o output é o objeto UserDetails que tem todos os atributos iguais ao User menos a pass
    public UserDetails getUserDetails(String username) {
        UserEntity userEntity = userDao.findUserByUsername(username);
        if(userEntity != null){
        return new UserDetails(
                userEntity.getUsername(),
                userEntity.getEmail(),
                userEntity.getFirstName(),
                userEntity.getLastName(),
                userEntity.getImgURL(),
                userEntity.getPhoneNumber()
        );
    }
    return null;
    }
    //getter do user a partir do seu username e da sua password
        //método para validar um user novo e dependendo da verificação em que falhar manda uma resposta diferente
    public int validateUserRegister(String username,String password, String email, String firstName, String lastName, String phoneNumber){

        final int EMPTY_FIELDS=0, USERNAME_EXISTS=1, EMAIL_EXISTS=2,INVALID_EMAIL=3,INVALID_PHONE=4,USER_VALIDATE=10;
        int VALIDATION_STATE=USER_VALIDATE;

        if(username.equals("") || password.equals("") || email.equals("") || firstName.equals("") || lastName.equals("") || phoneNumber.equals("")) {

            VALIDATION_STATE= EMPTY_FIELDS;
        }
        else if(!isValidEmail(email)){
            VALIDATION_STATE=INVALID_EMAIL;
        }
        else if (!isValidPhoneNumber(phoneNumber)){
            VALIDATION_STATE=INVALID_PHONE;
        }
        else{
            UserEntity userByUsername = userDao.findUserByUsername(username);
            UserEntity userByEmail = userDao.findUserByEmail(email);

            if(userByUsername != null){
                VALIDATION_STATE = USERNAME_EXISTS;
            }else if(userByEmail != null){
                VALIDATION_STATE = EMAIL_EXISTS;
            }
        }
        return VALIDATION_STATE;
    }

    //Recebe uma string e vê se é um número de telefone válido
    public boolean isValidPhoneNumber(String phoneNumber){
        boolean valideNumber=false;
        try {

            String cleanedPhoneNumber = phoneNumber.replaceAll("[^\\d]", "");

            if (cleanedPhoneNumber.length() == 9 || cleanedPhoneNumber.length() == 10) {
                valideNumber=true;
            } else {
                valideNumber= false;
            }
        } catch (NumberFormatException e) {
            valideNumber=false;
        }
        return valideNumber;
    }

    //verifica se um URL é válido
    public boolean isValidUrl(String urlString) {
        try {

            new URL(urlString);
            return true;
        } catch (MalformedURLException e) {

            return false;
        }
    }

    //verifica se um email é válido
    public boolean isValidEmail(String email) {
        boolean isValid = false;
        try {
            InternetAddress internetAddress = new InternetAddress(email);
            internetAddress.validate();
            isValid = true;
        } catch (AddressException e) {
        }
        return isValid;
    }



    public User validateLogin(String username, String password) {
        User user_validate=null;
        for (User user : users) {
            if (user.getUsername().equals(username)) {
                if(user.getPassword().equals(password)) user_validate=user;
            }
        }
        return user_validate;
    }

    public boolean removeUser(String username) {
        for (User user : users) {
            if (user.getUsername().equals(username)) {
                users.remove(user);
                return true;
            }
        }
        return false;
    }

/*
    public User updatePhoto(String username,String pass,String newPhoto){
        User currentUser = getUser(username,pass);
        currentUser.setImgURL(newPhoto);


        return currentUser;
    }
    public boolean updatePassword(String username, String password, String newPassword) {
        boolean fieldChanged = false;
            User u = getUser(username, password);
            if(u!=null) {
                u.setPassword(newPassword);

                fieldChanged = true;
            }

        return fieldChanged;
    }
    public boolean updateEmail(String username, String password, String email) {
        boolean fieldChanged = false;
        boolean validEmail = isValidEmail(email);
            User u = getUser(username, password);
            boolean emailAlreadyExists = emailExists(email);
            if (u !=null && validEmail && !emailAlreadyExists) {
                    u.setEmail(email);

                    fieldChanged = true;
        }
        return fieldChanged;
    }

    public boolean emailExists(String email){
        boolean emailExists = false;
            for (User u : users) {
                String userEmail = u.getEmail();
                if (userEmail != null && userEmail.equals(email)) {
                    emailExists = true;
                }
            }
        return emailExists;
    }

    public boolean updateFirstName(String username, String password, String firstName) {
        boolean fieldChanged = false;

            User u = getUser(username, password);
            if(u!=null){
                u.setFirstName(firstName);

                fieldChanged=true;
        }
        return fieldChanged;
    }
    public boolean updateLastName(String username, String password, String lastName) {
        boolean fieldChanged = false;
            User u = getUser(username, password);
            if(u!= null){
                u.setLastName(lastName);

                fieldChanged=true;
        }
        return fieldChanged;
    }

    public boolean updatePhoneNumber(String username, String password, String phoneNumber) {
        boolean fieldChanged = false;
            User u = getUser(username, password);

            boolean phoneValid=isValidPhoneNumber(phoneNumber);
            if (u!=null && phoneValid) {
                u.setPhoneNumber(phoneNumber);

                fieldChanged = true;
        }
        return fieldChanged;
    }

    public boolean phoneExists(String phoneNumber){
        boolean phoneExists = false;
        for(User u: users){
            if(u.getPhoneNumber().equals(phoneNumber)){
                phoneExists = true;
            }
        }
        return phoneExists;
    }

 */
}
