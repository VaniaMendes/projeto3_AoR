package aor.paj.service;


import aor.paj.bean.CategoryBean;
import aor.paj.bean.TaskBean;
import aor.paj.bean.UserBean;
import aor.paj.dto.Category;
import aor.paj.dto.Task;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/categories")
public class CategoryService {

    @Inject
    TaskBean taskBean;

    @Inject
    UserBean userBean;

    @Inject
    CategoryBean categoryBean;


    @POST
    @Path("/createCategory")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response addTask(@HeaderParam("token") String token, Category category) {
        Response response;

        if (!categoryBean.isUserAllowedToCreateCategories(token)) {
            response = Response.status(403).entity("You dont have permissions to do that").build();

        }else if (!categoryBean.isCategoryTitleAvailable(category)) {
            response = Response.status(422).entity("Category name already in use").build();

        } else if (categoryBean.addCategory(token, category)) {
            response = Response.status(200).entity("A new category is created").build();

        } else {
            response = Response.status(403).entity("Invalid Token").build();
        }

        return response;
    }
}
