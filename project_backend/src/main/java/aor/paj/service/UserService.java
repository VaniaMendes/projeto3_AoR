package aor.paj.service;

import aor.paj.bean.TaskBean;
import aor.paj.bean.UserBean;
import aor.paj.dto.LoginDto;
import aor.paj.dto.Task;
import aor.paj.dto.User;
import aor.paj.dto.UserDetails;

import aor.paj.entity.UserEntity;
import aor.paj.utils.EncryptHelper;
import jakarta.inject.Inject;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.io.StringReader;
import java.util.List;

@Path("/users")
public class UserService {

    @Inject
    UserBean userBean;

    @Inject
    TaskBean taskBean;

    @Inject
    EncryptHelper encryptHelper;


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
    @GET
    @Path("/user")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response getUserByToken(@HeaderParam("token") String token, @QueryParam("username") String username) {
        if (token != null) {

            User user = userBean.getUserByToken(token);

            if (user != null) {
                User userFind = userBean.getUserByUsername(username);
                return Response.ok(userFind).build();
            } else {

                return Response.status(Response.Status.NOT_FOUND).build();
            }
        } else {

            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }

    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response getAllUsers(@HeaderParam("Token") String token) {
        List<User> allUsers = userBean.getAllUsers();

        if (allUsers != null && !allUsers.isEmpty()) {
            return Response.ok(allUsers).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).entity("No users found").build();
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
                String plainPassword = updatedUser.getPassword();
                String hashedPassword = encryptHelper.encryptPassword(plainPassword);
                user.setPassword(hashedPassword);
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

    @PUT
    @Path("/{username}/updateUserRole")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateUser(@HeaderParam("token") String token, @PathParam("username") String username, String newRole) {
        Response response;

        JsonObject jsonObject = Json.createReader(new StringReader(newRole)).readObject();
        String newRoleConverted = jsonObject.getString("typeOfUser");

        if (userBean.getUserByToken(token) == null) {
            response = Response.status(403).entity("Invalid token").build();

        } else if (!userBean.getUserByToken(token).getTypeOfUser().equals("product_owner")) {
            response = Response.status(403).entity("You dont have permission to do that").build();

        } else if (!newRoleConverted.equals("developer") && !newRoleConverted.equals("scrum_master") && !newRoleConverted.equals("product_owner")) {
            response = Response.status(403).entity("Invalid role").build();

        } else if (userBean.updateUserRole(username, newRoleConverted)) {
            response = Response.status(200).entity("User role updated").build();

        } else {
            response = Response.status(401).entity("Role couldnt be updated").build();
        }

        return response;
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






    @DELETE
    @Path("/delete")
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeUser(@QueryParam("username")String username) {
        boolean deleted = userBean.removeUser(username);
        if (!deleted) return Response.status(200).entity("User with this username is not found").build();

        return Response.status(200).entity("deleted").build();
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
