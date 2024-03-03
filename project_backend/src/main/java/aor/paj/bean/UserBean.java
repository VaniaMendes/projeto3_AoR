package aor.paj.bean;

import aor.paj.dao.CategoryDao;
import aor.paj.dao.TaskDao;
import aor.paj.dao.UserDao;
import aor.paj.dto.LoginDto;
import aor.paj.dto.Task;
import aor.paj.dto.User;
import aor.paj.dto.UserDetails;
import aor.paj.entity.CategoryEntity;
import aor.paj.entity.TaskEntity;
import aor.paj.entity.UserEntity;
import aor.paj.utils.EncryptHelper;
import jakarta.ejb.EJB;
import jakarta.ejb.EntityBean;
import jakarta.ejb.Stateless;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.json.bind.JsonbConfig;
import jakarta.ejb.Singleton;
import jakarta.inject.Inject;
import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Singleton
public class UserBean implements Serializable {

    @EJB
    UserDao userDao;

    @EJB
    TaskDao taskDao;

    @EJB
    CategoryDao categoryDao;

    @EJB
    EncryptHelper encryptHelper;

    public UserBean(){
    }


    public String loginDB(LoginDto user){
        UserEntity userEntity = userDao.findUserByUsername(user.getUsername());
        user.setPassword(encryptHelper.encryptPassword(user.getPassword()));
        if (userEntity != null && userEntity.getIsActive()){
            if (userEntity.getPassword().equals(user.getPassword())){
                String token = generateNewToken();
                userEntity.setToken(token);
                return token;
            }
        }
        return null;
    }

    public List<User> getAllUsers() {
            List<User> users = new ArrayList<>();
            List<UserEntity> userEntities = userDao.findAllUsers();

            if(userEntities != null){
                for(UserEntity userEntity : userEntities){
                    User user = convertUserEntityToDto(userEntity);
                    users.add(user);
                }
            }

            return users;
    }

    public List<User> getActiveUsers(){

        List<User> users = new ArrayList<>();
        List<UserEntity> userEntities = userDao.findAllUsers();

        if(userEntities != null) {
            for (UserEntity userEntity : userEntities) {
                if (userEntity.getIsActive() && !userEntity.getUsername().equals("admin") && !userEntity.getUsername().equals("deletedUser")) {
                    User user = convertUserEntityToDto(userEntity);
                    users.add(user);
                }
            }
        }

        return users;

    }


    public List<User> getInactiveUsers(){

        List<User> users = new ArrayList<>();
        List<UserEntity> userEntities = userDao.findAllUsers();

        if(userEntities != null) {
            for (UserEntity userEntity : userEntities) {
                if (!userEntity.getIsActive() && !userEntity.getUsername().equals("admin") && !userEntity.getUsername().equals("deletedUser")) {
                    User user = convertUserEntityToDto(userEntity);
                    users.add(user);
                }
            }
        }

        return users;

    }

    /**
     *
     * @param token
     * @return return is null if user is not found or token not found
     */
    public boolean updateUserByPO(String token, String username, User updatedUser) {
        if (token == null || token.isEmpty()) {
            return false;
        }
        UserEntity userEntity = userDao.findUserByUsername(username);
        if (userEntity == null) {
            return false;
        }

        if (updatedUser.getEmail() != null ) {
            userEntity.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getFirstName() != null) {
            userEntity.setFirstName(updatedUser.getFirstName());
        }
        if (updatedUser.getLastName() != null) {
            userEntity.setLastName(updatedUser.getLastName());
        }
        if (updatedUser.getPhoneNumber() != null) {
            userEntity.setPhoneNumber(updatedUser.getPhoneNumber());
        }
        if (updatedUser.getImgURL() != null) {
            userEntity.setImgURL(updatedUser.getImgURL());
        }
        if (updatedUser.getPassword() != null){
            userEntity.setPassword(updatedUser.getPassword());
        }
        if(updatedUser.getTypeOfUser() != null){
            userEntity.setTypeOfUser(updatedUser.getTypeOfUser());

        }
        return userDao.update(userEntity);

    }


    public boolean updateUser(String token, User updatedUser) {
        if (token == null || token.isEmpty()) {
            return false;
        }
        UserEntity userEntity = userDao.findUserByToken(token);
        if (userEntity == null) {
            return false;
        }

        if (updatedUser.getEmail() != null ) {
            userEntity.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getFirstName() != null) {
            userEntity.setFirstName(updatedUser.getFirstName());
        }
        if (updatedUser.getLastName() != null) {
            userEntity.setLastName(updatedUser.getLastName());
        }
        if (updatedUser.getPhoneNumber() != null) {
            userEntity.setPhoneNumber(updatedUser.getPhoneNumber());
        }
        if (updatedUser.getImgURL() != null) {
            userEntity.setImgURL(updatedUser.getImgURL());
        }
        if (updatedUser.getPassword() != null){
            userEntity.setPassword(updatedUser.getPassword());
    }
            return userDao.update(userEntity);

    }


    /**
     * Update ao role do user, só disponivel para users do tipo product owner
     * @param username
     * @param newRole
     * @return
     */
    public boolean updateUserRole(String username, String newRole) {
        boolean status;

        UserEntity userEntity = userDao.findUserByUsername(username);

        if(userEntity != null) {
            userEntity.setTypeOfUser(newRole);
            userDao.update(userEntity);
            status = true;
        } else {
            status = false;
        }


        return status;
    }


    public User getUserByToken(String token) {
        UserEntity userEntity = userDao.findUserByToken(token);
        User u = null;
        u = convertUserEntityToDto(userEntity);
        return u;
    }
    public User getUserByUsername(String username) {
        UserEntity userEntity = userDao.findUserByUsername(username);
        User u = null;
        u = convertUserEntityToDto(userEntity);
        return u;
    }


    private String generateNewToken() {
        SecureRandom secureRandom = new SecureRandom();
        Base64.Encoder base64Encoder = Base64.getUrlEncoder();
        byte[] randomBytes = new byte[24];
        secureRandom.nextBytes(randomBytes);
        return base64Encoder.encodeToString(randomBytes);
    }

    public User convertUserEntityToDto(UserEntity userEntity) {
        if(userEntity != null) {
            User userDto = new User();
            userDto.setUsername(userEntity.getUsername());
            userDto.setPassword(userEntity.getPassword());
            userDto.setEmail(userEntity.getEmail());
            userDto.setPhoneNumber(userEntity.getPhoneNumber());
            userDto.setImgURL(userEntity.getImgURL());
            userDto.setFirstName(userEntity.getFirstName());
            userDto.setLastName(userEntity.getLastName());
            userDto.setTypeOfUser(userEntity.getTypeOfUser());
            userDto.setActive(userEntity.getIsActive());
            return userDto;
        }
        return null;
    }

    public User convertUserEntityToDtoForTask(UserEntity userEntity) {
        if(userEntity != null) {
            User userDto = new User();
            userDto.setUsername(userEntity.getUsername());

            return userDto;
        }
        return null;
    }


    public UserEntity convertUserDtotoUserEntity(User user){
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(user.getUsername());
        userEntity.setPassword(user.getPassword());
        userEntity.setToken(user.getToken());
        userEntity.setEmail(user.getEmail());
        userEntity.setPhoneNumber(user.getPhoneNumber());
        userEntity.setImgURL(user.getImgURL());
        userEntity.setFirstName(user.getFirstName());
        userEntity.setLastName(user.getLastName());
        userEntity.setIsActive(true);
        userEntity.setTypeOfUser(user.getTypeOfUser());
        return userEntity;
    }


    public boolean register(User user){
        UserEntity u= userDao.findUserByUsername(user.getUsername());

        if (u==null){
            user.setPassword(encryptHelper.encryptPassword(user.getPassword()));
            userDao.persist(convertUserDtotoUserEntity(user));
            return true;
        }else
            return false;
    }

    public boolean registerByPO(String token,User user){
        UserEntity userEntityPO = userDao.findUserByToken(token);

        if(userEntityPO != null && userEntityPO.getTypeOfUser().equals("product_owner")) {

            UserEntity u = userDao.findUserByUsername(user.getUsername());

            if (u == null) {
                user.setPassword(encryptHelper.encryptPassword(user.getPassword()));
                userDao.persist(convertUserDtotoUserEntity(user));
                return true;
            } else
                return false;
        }else{
            return false;
        }
    }

    public boolean isAnyFieldEmpty(User user) {
        boolean status = false;

        if (user.getUsername().isEmpty() ||
                user.getPassword().isEmpty() ||
                user.getEmail().isEmpty() ||
                user.getFirstName().isEmpty() ||
                user.getLastName().isEmpty() ||
                user.getPhoneNumber().isEmpty() ||
                user.getImgURL().isEmpty()) {
            status = true;
        }
        return status;
    }

    private boolean isEmailFormatValid(String email) {

        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        return email.matches(emailRegex);
    }

    public boolean isEmailValid(String email) {
        if (!isEmailFormatValid(email)) {
            return false;
        }

        UserEntity userEntity = userDao.findUserByEmail(email);

        return userEntity == null;
    }


    public boolean isUsernameAvailable(String username) {

        UserEntity userEntity = userDao.findUserByUsername(username);

        return userEntity == null;
    }

    public boolean isImageUrlValid(String url) {
        boolean status = true;

        if (url == null) {
            status = false;
        }

        try {
            BufferedImage img = ImageIO.read(new URL(url));
            if (img == null) {
                status = false;
            }
        } catch (IOException e) {
            status = false;
        }

        return status;
    }


    public boolean isPhoneNumberValid(String phone) {
        boolean status = true;
        int i = 0;

        while (status && i < phone.length() - 1) {
            if (phone.length() == 9) {
                for (; i < phone.length(); i++) {
                    if (!Character.isDigit(phone.charAt(i))) {
                        status = false;
                    }
                }
            } else {
                status = false;
            }
        }
        return status;
    }

    public boolean emailAvailable (String email){
        UserEntity userEntity = userDao.findUserByEmail(email);

        return userEntity == null;
    }

    public boolean removeUser(String username){
        UserEntity userEntity = userDao.findUserByUsername(username);
        boolean wasRemoved=false;
        if (userEntity != null) {
            userEntity.setIsActive(false);
            wasRemoved =  userDao.update(userEntity);
        }
        return wasRemoved;
    }
    public boolean restoreUser(String username){
        UserEntity userEntity = userDao.findUserByUsername(username);
        boolean wasRemoved=false;
        if (userEntity != null) {
            userEntity.setIsActive(true);
            wasRemoved =  userDao.update(userEntity);
        }
        return wasRemoved;
    }

    public boolean deletePermanentlyUser(String username){
        UserEntity userEntity = userDao.findUserByUsername(username);
        ArrayList<TaskEntity> tasks = taskDao.findTasksByUser(userEntity);
        ArrayList<CategoryEntity> categories = categoryDao.findCategoriesByUser(userEntity);

        boolean wasRemoved=false;
        if (userEntity != null && !userEntity.getUsername().equals("deletedUser") && !userEntity.getUsername().equals("admin")) {

            if (tasks != null) {
                for (TaskEntity task : tasks) {
                    task.setOwner(userDao.findUserByUsername("deletedUser"));
                }
            }

            if (categories != null) {
                for (CategoryEntity category : categories) {
                    category.setOwner(userDao.findUserByUsername("deletedUser"));
                }
            }

            userEntity.setIsActive(false);
            userDao.remove(userEntity);
            wasRemoved = true;
        }
        return wasRemoved;
    }
    public boolean logoutUser(String token){
        UserEntity userEntity = userDao.findUserByToken(token);
        boolean wasRemovedToken = false;
        if(userEntity != null){
            wasRemovedToken = userDao.removedToken(userEntity);
        }

        return wasRemovedToken;
    }



    ///////////////////////METODOS ANTIGOS\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
/*
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

     */

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


    public void createDefaultUsersIfNotExistent() {
        UserEntity userEntity = userDao.findUserByUsername("admin");
        if (userEntity == null) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword("admin");
            admin.setEmail("admin@admin.com");
            admin.setFirstName("admin");
            admin.setLastName("admin");
            admin.setPhoneNumber("123456789");
            admin.setImgURL("https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png");
            admin.setTypeOfUser("product_owner");

            register(admin);
        }

        UserEntity userEntity2 = userDao.findUserByUsername("deletedUser");
        if (userEntity2 == null) {
            User deletedUser = new User();
            deletedUser.setUsername("deletedUser");
            deletedUser.setPassword("123");
            deletedUser.setEmail("deleted@user.com");
            deletedUser.setFirstName("Deleted");
            deletedUser.setLastName("User");
            deletedUser.setPhoneNumber("123456789");
            deletedUser.setImgURL("https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png");
            deletedUser.setTypeOfUser("developer");
            deletedUser.setActive(false);

            register(deletedUser);
        }
    }
}
