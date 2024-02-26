package aor.paj.service;

import aor.paj.bean.TaskBean;
import aor.paj.bean.UserBean;
import aor.paj.dao.CategoryDao;
import aor.paj.dto.Category;
import aor.paj.dto.Task;
import aor.paj.dto.User;
import jakarta.inject.Inject;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.io.StringReader;

@Path("/tasks")
public class TaskService {

    @Inject
    TaskBean taskBean;

    @Inject
    UserBean userBean;

    @Inject
    CategoryDao categoryDao;

    //getter das tasks

    @POST
    @Path("/createTask")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response addTask(@HeaderParam("token") String token, Task task) {

        Response response;

        if (userBean.getUserByToken(token) == null) {
            response = Response.status(403).entity("Invalid token").build();

        } else if (task.getCategory() == null || categoryDao.findCategoryById(task.getCategory().getIdCategory()) == null) {
            response = Response.status(422).entity("Invalid category").build();

        } else if (!taskBean.isTaskTitleAvailable(task)) {
            response = Response.status(422).entity("Title not available").build();

        } else if (task.getInitialDate().isAfter(task.getEndDate())) {
            response = Response.status(422).entity("Initial date cannot be after the end date").build();

        } else if (task.getPriority() != 100 && task.getPriority() != 200 && task.getPriority() != 300) {
            response = Response.status(422).entity("Priority can only be 100, 200 or 300").build();

        } else if (!task.getState().equals("toDo") && !task.getState().equals("doing") && !task.getState().equals("done")) {
            response = Response.status(422).entity("State can only be toDo, doing or done").build();

        } else if (taskBean.addTask(token,task)) {
            response = Response.status(200).entity("A new task is created").build();

        } else {
            response = Response.status(400).entity("Failed to update task").build();
        }

        return response;
    }

    @PUT
    @Path("/updateTask/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateTask(@HeaderParam("token") String token, @PathParam("id") String id, Task task) {

        Response response;

        //TODO TESTAR ESTA MERDA,
        // VERIFICAR SE O ID ESTÁ CORRETO,


        if (userBean.getUserByToken(token) == null) {
            response = Response.status(403).entity("Invalid token").build();

        } else if (task.getCategory() == null || categoryDao.findCategoryById(task.getCategory().getIdCategory()) == null) {
            response = Response.status(422).entity("Invalid category").build();

        } else if (!taskBean.isTaskTitleAvailable(task)) {
            response = Response.status(422).entity("Title not available").build();

        } else if (task.getInitialDate().isAfter(task.getEndDate())) {
            response = Response.status(422).entity("Initial date cannot be after the end date").build();

        } else if (task.getPriority() != 100 && task.getPriority() != 200 && task.getPriority() != 300) {
           response = Response.status(422).entity("Priority can only be 100, 200 or 300").build();

        } else if (!task.getState().equals("toDo") && !task.getState().equals("doing") && !task.getState().equals("done")) {
            response = Response.status(422).entity("State can only be toDo, doing or done").build();

        } else if (taskBean.updateTask(token, id, task)) {
            response = Response.status(200).entity("Task updated sucessfully").build();

        } else
            response = Response.status(400).entity("Failed to update task").build();

        return response;
    }

    @PUT
    @Path("/{taskId}/updateCategory")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateTaskCategory(@HeaderParam("token") String token, @PathParam("taskId") String taskId, Category category) {
        Response response;

        User requestingUser = userBean.getUserByToken(token);

        if (!requestingUser.getTypeOfUser().equals("Product Owner")) {
            response = Response.status(409).entity("You dont have permissions to edit that").build();

        } else if (taskBean.updateTaskCategory(token, taskId, category)) {
            response = Response.status(200).entity("Task category changed successfully").build();

        } else {
            response = Response.status(400).entity("Task category update failed").build();
        }
        return response;
    }

    @PUT
    @Path("/{taskId}/status")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateTaskStatus(@HeaderParam("token") String token, @PathParam("taskId") String taskId, String newStatus) {
        Response response;

        JsonObject jsonObject = Json.createReader(new StringReader(newStatus)).readObject();
        String newStatusConverted = jsonObject.getString("state");

        if (!newStatusConverted.equalsIgnoreCase("toDo") && !newStatusConverted.equalsIgnoreCase("doing") && !newStatusConverted.equalsIgnoreCase("done")) {
            response = Response.status(422).entity("State can only be toDo, doing or done").build();

        } else if (taskBean.updateTaskState(token, taskId, newStatusConverted)) {
            response = Response.status(200).entity("Task state updated successfully").build();

        } else
            response = Response.status(400).entity("Failed to update task state").build();

        return response;
    }

    /**
     * Editar atributo isActive da task (soft delete), permite ao scrum master só colocar
     * para falso, enquanto ao owner pode mudar para false ou true, o developer não deixa
     * fazer nada
     * @param token
     * @param taskId
     * @param newStatus
     * @return
     */
    @PUT
    @Path("/{taskId}/softDelete")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response softDeleteTask(@HeaderParam("token") String token, @PathParam("taskId") String taskId, String newStatus) {
        Response response;

        JsonObject jsonObject = Json.createReader(new StringReader(newStatus)).readObject();
        boolean newActiveStatus = jsonObject.getBoolean("isActive");

        if(!userBean.getUserByToken(token).getTypeOfUser().equals("product_owner") && !userBean.getUserByToken(token).getTypeOfUser().equals("scrum_master")) {
            response = Response.status(409).entity("You dont have permissions to edit that").build();

        } else if (userBean.getUserByToken(token).getTypeOfUser().equals("scrum_master") && newActiveStatus) {
            response = Response.status(409).entity("Your role doesnt allow that").build();

        } else if (taskBean.updateTaskActiveState(token, taskId, newActiveStatus)) {
            response = Response.status(200).entity("Task active state updated successfully").build();

        } else
            response = Response.status(400).entity("Failed to update task active state").build();

        return response;
    }

    /*
    @GET
    @Path("/")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Task> getTasks(@HeaderParam("username")String username, @HeaderParam("pass")String password) {
        User user=userBean.getUser(username, password);
        if(user==null)  return null;
        return user.getTasks();
    }


    //getter da task com o id {id}
    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Task getTask(@PathParam("id")String id,@HeaderParam("username")String username, @HeaderParam("pass")String password) {
        User userRequested=userBean.getUser(username, password);

        if (userRequested==null) return null;
        long idLong=Long.parseLong(id);

        return userBean.getTask(userRequested,idLong);
    }


    @PUT
    @Path("/update")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateTask(@HeaderParam("username") String username,@HeaderParam("pass")String password,@HeaderParam("id") long id,@HeaderParam("title") String title,
                               @HeaderParam("description") String description, @HeaderParam("initialDate") String initialDate,
                               @HeaderParam("endDate")String endDate, @HeaderParam("priority")int priority){

        User userRequested=userBean.getUser(username, password);
        if (userRequested==null){
            return Response.status(404).entity("This user doesn't exist").build();
        }
        else {
            Task taskChanged = userBean.getTask(userRequested, id);
            if (taskChanged == null) {
                return Response.status(404).entity("This task doesn't exist").build();
            }
            if (title.equals("")) {
                return Response.status(400).entity("The task must have a title").build();
            } else {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                LocalDate initialDateFormated = LocalDate.parse(initialDate, formatter);
                LocalDate endDateFormated = LocalDate.parse(endDate, formatter);
                LocalDate currentDate=LocalDate.now();
                if (endDateFormated.isBefore(initialDateFormated) || initialDateFormated.isBefore(currentDate)  ) {
                    return Response.status(400).entity("Entered wrong date").build();
                } else {
                    if (priority != 300 && priority != 200 && priority != 100) {
                        return Response.status(400).entity("This priority isn't valid").build();
                    } else {
                        userBean.updateTask(taskChanged, title, description, initialDateFormated, endDateFormated, priority);
                        return Response.status(200).entity("Task was updated").build();
                    }
                }
            }
        }
    }

    @PUT
    @Path("/state")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateState(@HeaderParam("username")String username,@HeaderParam("pass")String password, @HeaderParam("id")long id,@HeaderParam("state")String state){
        User userRequested=userBean.getUser(username, password);
        if (userRequested==null){
            return Response.status(404).entity("This user doesn't exist").build();
        }
        else {
            Task taskRequested = userBean.getTask(userRequested, id);
            if(taskRequested==null){
                return Response.status(404).entity("This task id doesn't exist").build();
            }
            else {
                if(state.equals("toDo") || state.equals("doing") || state.equals("done")) {
                    userBean.updateTaskState(taskRequested, state);
                    return Response.status(200).entity("Task was updated").build();
                }
                else  return Response.status(400).entity("This state isn't valid").build();
            }
        }
    }

    @POST
    @Path("/oldCreate")
    @Produces(MediaType.APPLICATION_JSON)
    public Response oldAddTask(@HeaderParam("username")String username,@HeaderParam("pass")String password ,Task task){
        User userRequested=userBean.getUser(username, password);
        if (userRequested==null){
            return Response.status(404).entity("This user doesn't exist").build();
        }
        else {

            LocalDate currentDate=LocalDate.now();
            if(!task.getTitle().equals("") && task.getEndDate().isAfter(task.getInitialDate()) && (task.getInitialDate().isAfter(currentDate) || task.getInitialDate().isEqual(currentDate))) {
                userBean.addTask(userRequested, task);
                return Response.status(200).entity("Task created").build();
            }
            else{
                return Response.status(404).entity("Entered wrong data").build();
            }
        }
    }


    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeTask(@HeaderParam("username")String username,@HeaderParam("pass")String pass,@PathParam("id") long id) {
        User userRequested=userBean.getUser(username,pass);
        if (userRequested!=null) {
            boolean deleted = userBean.removeTask(userRequested,id);
            if (deleted) return Response.status(200).entity("deleted").build();
            else   return Response.status(406).entity("Task with this id was not found").build();
        }
        else{
            return Response.status(404).entity("This user doesn't exist").build();
        }
    }

     */

}