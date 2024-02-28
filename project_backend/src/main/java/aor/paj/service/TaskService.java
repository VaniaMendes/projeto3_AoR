package aor.paj.service;

import aor.paj.bean.TaskBean;
import aor.paj.bean.UserBean;
import aor.paj.dao.CategoryDao;
import aor.paj.dto.Category;
import aor.paj.dto.Task;
import aor.paj.dto.User;
import aor.paj.entity.TaskEntity;
import jakarta.inject.Inject;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;

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

        if (userBean.getUserByToken(token) == null) {
            response = Response.status(403).entity("Invalid token").build();

        } else if (!requestingUser.getTypeOfUser().equals("Product Owner")) {
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

        if (userBean.getUserByToken(token) == null) {
            response = Response.status(403).entity("Invalid token").build();

        } else if (!newStatusConverted.equalsIgnoreCase("toDo") && !newStatusConverted.equalsIgnoreCase("doing") && !newStatusConverted.equalsIgnoreCase("done")) {
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
     * @param
     * @return
     */
    @PUT
    @Path("/{taskId}/softDelete")
    @Produces(MediaType.APPLICATION_JSON)
    public Response softDeleteTask(@HeaderParam("token") String token, @PathParam("taskId") String taskId) {
        Response response;


        if (userBean.getUserByToken(token) == null) {
            response = Response.status(403).entity("Invalid token").build();

        } else if(!userBean.getUserByToken(token).getTypeOfUser().equals("product_owner") && !userBean.getUserByToken(token).getTypeOfUser().equals("scrum_master")) {
            response = Response.status(409).entity("You dont have permissions to edit that").build();


        } else if (taskBean.updateTaskActiveState(token, taskId)) {
            response = Response.status(200).entity("Task active state updated successfully").build();

        } else
            response = Response.status(400).entity("Failed to update task active state").build();

        return response;
    }

    @GET
    @Path("/getAllSoftDeletedTasks")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getsoftDeletedTasks(@HeaderParam("token") String token) {
        Response response;

        ArrayList<Task> softDeletedTasks = taskBean.getSoftDeletedTasks();

        if (userBean.getUserByToken(token) == null) {
            response = Response.status(403).entity("Invalid token").build();

        } else if (!userBean.getUserByToken(token).getTypeOfUser().equals("scrum_master") && !userBean.getUserByToken(token).getTypeOfUser().equals("product_owner")) {
            response = Response.status(403).entity("You dont have permissions to do that").build();

        } else if (softDeletedTasks != null) {
            response = Response.status(200).entity(softDeletedTasks).build();

        } else {
            response = Response.status(400).entity("Failed to retrieve tasks").build();
        }


        return response;
    }

    @DELETE
    @Path("/{username}/deleteTasksByUsername")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteAllTasksByUsername(@HeaderParam("token") String token, @PathParam("username") String username) {
        Response response;

        if (userBean.getUserByToken(token) == null) {
            response = Response.status(403).entity("Invalid token").build();

        } else if (!userBean.getUserByToken(token).getTypeOfUser().equals("product_owner")) {
            response = Response.status(403).entity("You dont have permissions to do that").build();

        } else if (taskBean.deleteTasksByUsername(username))  {
            response = Response.status(200).entity("Tasks deleted successfully").build();

        } else {
            response = Response.status(400).entity("Failed to execute order").build();
        }

        return response;
    }

    @DELETE
    @Path("/{id}/hardDeleteTask")
    @Produces(MediaType.APPLICATION_JSON)
    public Response hardDeleteTask(@HeaderParam("token") String token, @PathParam("id") String id) {
        Response response;

        if (userBean.getUserByToken(token) == null) {
            response = Response.status(403).entity("Invalid token").build();

        } else if (!userBean.getUserByToken(token).getTypeOfUser().equals("product_owner")) {
            response = Response.status(403).entity("You dont have permissions to do that").build();

        } else if (taskBean.hardDeleteTask(token, id))  {
            response = Response.status(200).entity("Task permanently deleted").build();

        } else {
            response = Response.status(400).entity("Failed to execute order").build();
        }

        return response;
    }


    //Método para filtrar tasks por categoria
    @GET
    @Path("/userTasks")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserTasksByCategory(@HeaderParam("token") String token, @QueryParam("categoryName") String categoryName) {
        User user = userBean.getUserByToken(token);
        if (user == null) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Invalid token").build();
        }
        if (!user.getTypeOfUser().equals("product_owner") || !user.getTypeOfUser().equals("scrum_master")) {
            return Response.status(Response.Status.FORBIDDEN).entity("You don't have permission to access this resource").build();
        }
        if (categoryName == null || categoryName.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Category name is required").build();
        }

        List<Task> userTasksByCategory = taskBean.getTasksByCategoryName(categoryName);
        if (userTasksByCategory.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).entity("No tasks found for this user and category").build();
        }

        return Response.ok(userTasksByCategory).build();
    }

}
