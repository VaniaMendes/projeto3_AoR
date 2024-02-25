package aor.paj.service;

import aor.paj.bean.TaskBean;
import aor.paj.bean.UserBean;
import aor.paj.dto.LoginDto;
import aor.paj.dto.Task;
import aor.paj.dto.User;
import aor.paj.dto.UserDetails;

import aor.paj.entity.UserEntity;
import jakarta.inject.Inject;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/users")
public class UserService {

    @Inject
    UserBean userBean;

    @Inject
    TaskBean taskBean;


    @POST
    @Path("/addUserDB")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response addUserToDB(User user) {

        Response response;

        boolean isFieldEmpty = userBean.isAnyFieldEmpty(user);
        boolean isEmailValid = userBean.isEmailValid(user.getEmail());
        boolean isUsernameAvailable = userBean.isUsernameAvailable(user.getUsername());
        boolean isImageValid = userBean.isImageUrlValid(user.getImgURL());
        boolean isPhoneValid = userBean.isPhoneNumberValid(user.getPhoneNumber());


        if (isFieldEmpty) {
            response = Response.status(422).entity("There's an empty field. ALl fields must be filled in").build();

        } else if (!isEmailValid) {
            response = Response.status(422).entity("Invalid email").build();

        } else if (!isUsernameAvailable) {
            response = Response.status(Response.Status.CONFLICT).entity("Username already in use").build(); //status code 409

        } else if (!isImageValid) {
            response = Response.status(422).entity("Image URL invalid").build(); //400

        } else if (!isPhoneValid) {
            response = Response.status(422).entity("Invalid phone number").build();

        } else if (userBean.register(user)) {
            response = Response.status(Response.Status.CREATED).entity("User registered successfully").build(); //status code 201

        } else {
            response = Response.status(Response.Status.BAD_REQUEST).entity("Something went wrong").build(); //status code 400

        }

        return response;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response getUserByToken(@HeaderParam("Token") String token) {
        if (token != null) {

            User user = userBean.getUserByToken(token);

            if (user != null) {
                return Response.ok(user).build();
            } else {

                return Response.status(Response.Status.NOT_FOUND).build();
            }
        } else {

            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(LoginDto user) {
        String token = userBean.loginDB(user);
        if (token != null) {
            // Criar um objeto JSON contendo apenas o token
            JsonObject jsonResponse = Json.createObjectBuilder()
                    .add("token", token)
                    .build();
            // Retornar a resposta com o token
            return Response.status(200).entity(jsonResponse).build();

        } else {
            return Response.status(403).entity("{\"error\": \"Wrong Username or Password!\"}").build();
        }
    }

    @PUT
    @Path("/updateProfile")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateUser(@HeaderParam("token") String token, User updatedUser) {
        User user = userBean.getUserByToken(token);

        if (user != null) {
            if (updatedUser.getEmail() != null) {
                if (!userBean.isEmailValid(updatedUser.getEmail())) {
                    return Response.status(422).entity("Invalid email").build();
                } else if(!userBean.emailAvailable(updatedUser.getEmail())) {
                    return Response.status(422).entity("Email allready exists").build();
                }else {
                    user.setEmail(updatedUser.getEmail());
                }
            }
            if (updatedUser.getFirstName() != null) {
                user.setFirstName(updatedUser.getFirstName());
            }
            if (updatedUser.getLastName() != null) {
                user.setLastName(updatedUser.getLastName());
            }
            if (updatedUser.getPhoneNumber() != null) {
                if (!userBean.isPhoneNumberValid(updatedUser.getPhoneNumber())) {
                    return Response.status(422).entity("Invalid phone number").build();
                } else {
                    user.setPhoneNumber(updatedUser.getPhoneNumber());
                }
            }
            if (updatedUser.getImgURL() != null) {
                if (!userBean.isImageUrlValid(updatedUser.getImgURL())) {
                    return Response.status(422).entity("Image URL invalid").build();
                } else {
                    user.setImgURL(updatedUser.getImgURL());
                }
            }

            if(updatedUser.getPassword() != null){
                user.setPassword(updatedUser.getPassword());
            }


            boolean updatedUSer = userBean.updateUser(token, user);
            if (updatedUSer) {
                return Response.status(Response.Status.OK).entity(user).build();
            } else {
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Failed to update user").build();
            }
        }else{
        return Response.status(401).entity("Invalid credentials").build();
    }
}




    /////////////////////REQUESTS ANTIGOS\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

    //@GET
    //@Path("/all")
    //@Produces(MediaType.APPLICATION_JSON)
    //public List<User> getUsers() {
    //    return userBean.getUsers();
    //}

    @GET
    @Path("/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUsern(@PathParam("username")String username){
        UserDetails userRequested=userBean.getUserDetails(username);
        if (userRequested==null) return Response.status(400).entity("Failed").build();
        return Response.status(200).entity(userRequested).build();
    }
/*
    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(LoginDto user){
        String token = userBean.login(user);
        if(token != null){
            return Response.status(200).entity(token).build();
        }
        return Response.status(403).entity("Wrong Username or Password!").build();
    }
*/
    @POST
    @Path("/register")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response validateUserRegister(User user) {

        int validate = userBean.validateUserRegister(
                user.getUsername(),
                user.getPassword(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber()
        );

        if (validate==10) return Response.status(200).entity("New user was validated").build();

        else if(validate==4) return Response.status(400).entity("Phone number invalid").build();

        else if(validate==3) return Response.status(400).entity("Email invalid").build();

        else if(validate==2) return Response.status(409).entity("Email exists").build();

        else if(validate==1) return Response.status(409).entity("Username exists").build();

        else if(validate==0) return Response.status(400).entity("There are empty fields").build();

        return Response.status(405).entity("Something went wrong").build();

    }

    @POST
    @Path("/add")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response addUser(User user) {
        int validateUser = userBean.validateUserRegister(
                user.getUsername(),
                user.getPassword(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber()

        );
            if (validateUser == 10) {
                if (userBean.isValidUrl(user.getImgURL())) {
                    userBean.addUser(user);
                    return Response.status(200).entity("A new user was created").build();
                } else return Response.status(400).entity("The URL is invalid").build();
            } else if (validateUser == 4) return Response.status(400).entity("Phone number invalid").build();

            else if (validateUser == 3) return Response.status(400).entity("Email invalid").build();

            else if (validateUser == 2) return Response.status(409).entity("Email exists").build();

            else if (validateUser == 1) return Response.status(409).entity("Username exists").build();

            else if (validateUser == 0) return Response.status(400).entity("There are empty fields").build();

            return Response.status(405).entity("Something went wrong").build();

    }








    @DELETE
    @Path("/delete")
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeUser(@QueryParam("username")String username) {
        boolean deleted = userBean.removeUser(username);
        if (!deleted) return Response.status(200).entity("User with this username is not found").build();

        return Response.status(200).entity("deleted").build();
    }
    @PUT
    @Path("/updatePhoto")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updatePhoto(@HeaderParam("username") String username, @HeaderParam("password")String password,@HeaderParam("newPhoto") String newPhoto){
        User updateUser = userBean.updatePhoto(username, password,newPhoto);
        if(updateUser != null){
            return Response.status(200).entity(updateUser).build();
        }else{
            return Response.status(404).entity("not found").build();
        }
    }
    @PUT
    @Path("/updatePassword")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updatePassword(@HeaderParam("username") String username, @HeaderParam("password") String password, @HeaderParam("newPassword") String newPassword){
        boolean fieldChanged = userBean.updatePassword(username, password, newPassword);
        if(fieldChanged){
            return Response.status(200).entity("Password changed with successfuly").build();
        }else{
            return Response.status(404).entity("not found").build();
        }

    }

    @PUT
    @Path("/updateEmail")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateEmail(@HeaderParam("username") String username, @HeaderParam("password") String password, @HeaderParam("email") String email){
        boolean fieldChanged = userBean.updateEmail(username, password, email);
        if(fieldChanged){
            return Response.status(200).entity("Email changed with successfuly").build();
        }else{
            return Response.status(404).entity("not found").build();
        }
    }

    @PUT
    @Path("/updateFirstName")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateFirstName(@HeaderParam("username") String username, @HeaderParam("password") String password, @HeaderParam("firstName") String firstName){
        boolean fieldChanged = userBean.updateFirstName(username, password,firstName);
        if(fieldChanged){
            return Response.status(200).entity("First Name changed with successfuly").build();
        }else{
            return Response.status(404).entity("not found").build();
        }

    }
    @PUT
    @Path("/updateLastName")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateLastName(@HeaderParam("username") String username, @HeaderParam( "password") String password, @HeaderParam("lastName") String lastName){
           boolean fieldChanged = userBean.updateLastName(username, password, lastName);
            if(fieldChanged){
                return Response.status(200).entity("Last Name changed with successfuly").build();
            }else{
                return Response.status(404).entity("not found").build();
            }
    }

    @PUT
    @Path("/updatePhoneNumber")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updatePhoneNumber(@HeaderParam("username") String username, @HeaderParam("password") String password, @HeaderParam("phonenumber") String phonenumber){
        boolean fieldChanged = userBean.updatePhoneNumber(username, password, phonenumber);
        if(fieldChanged){
            return Response.status(200).entity("Phone Number  changed with successfuly").build();
        }else{
            return Response.status(404).entity("not found").build();
        }

    }


    @POST
    @Path("/logout")
    @Produces(MediaType.APPLICATION_JSON)
    public Response logoutValidate(@HeaderParam("username") String username, @HeaderParam("password")String pass){
        User userRequest=userBean.getUser(username,pass);

        if (userRequest==null) return Response.status(401).entity("Failed").build();

        return Response.status(200).entity("Success").build();
    }


}
