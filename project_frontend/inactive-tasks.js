window.onload = function() {

    const token = sessionStorage.getItem("token");
    const firstName_txt = document.querySelector("#user");
    const user_img = document.querySelector("#user_img");

    getAllInactiveTasks(token);

    getUserByToken(token).then((result) => {
       user = result;
       if (user == null) {
          window.location.href = "login.html";
       } else {
          firstName_txt.textContent = user.firstName;
          const role = user.typeOfUser;
          sessionStorage.setItem('userType', role);
         
    
          if(user.imgURL){
             user_img.src = user.imgURL;
          }else{user_img.src = 'user.png';
       }
       addButtonsForUserType(role);
          
       }
    });
 
 }
 document.querySelector("#logout").addEventListener("click", function () {
    if (confirm("Are you sure you want to logout?")) {
       sessionStorage.clear();
       window.location.href = "login.html";
    }
 });


 document.querySelector("#btn_scrumBoard").addEventListener("click", function () {
    
    window.location.href = "scrum.html";
    
 });

async function getUserByToken(token) {
    try {
        const response = await fetch("http://localhost:8080/project_backend/rest/users", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                token:token
            }
        });
 
        if (response.ok) {
            const user = await response.json();
            return user;
        } else {
            console.error("Failed to fetch user data");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
 }
 
 function addButtonsForUserType(userType) {
    const menu = document.getElementById('menu'); //  elemento com o ID 'menu' onde os botões serão adicionados
 
    if (userType === 'product_owner') {
        
        // Adicionar botão para consultar lista de todos os usuários
        const listButton = document.createElement('button'); listButton.id = "listButton";
        listButton.classList.add("menu_item"); listButton.innerHTML = ".";
        listButton.textContent = 'All Users';
        listButton.addEventListener('click', function() {
          window.location.href = "productOwner.html";
            
        });
 
        

          //botão que chama criar categoria, só aparece nesta página

          const createCategoryButton = document.createElement('button'); createCategoryButton.id = "listButton";
          createCategoryButton.classList.add("menu_item"); createCategoryButton.innerHTML = ".";
          createCategoryButton.textContent = 'Categories';
            createCategoryButton.addEventListener('click', function() {
               window.location.href = "createCategory.html";
               
            });

          

    
 
       menu.appendChild(listButton);
       menu.appendChild(createCategoryButton);
        
       
    } else if (userType === 'scrum_master') {

      // Adicionar botão para consultar lista de todos os usuários
      const listButton = document.createElement('button'); listButton.id = "listButton";
      listButton.classList.add("menu_item"); listButton.innerHTML = ".";
      listButton.textContent = 'All Users';
      listButton.addEventListener('click', function() {
        window.location.href = "productOwner.html";
          
      });


      const inactiveTasksButton = document.createElement('button'); inactiveTasksButton.id = "inactiveTasksButton";
     inactiveTasksButton.classList.add("menu_item"); inactiveTasksButton.innerHTML = ".";
     inactiveTasksButton.textContent = 'Inactive Tasks';
     inactiveTasksButton.addEventListener('click', function() {
        window.location.href = "inactive-tasks.html";
     });
      menu.appendChild(listButton);
      menu.appendChild(inactiveTasksButton);

     
 
    } else if (userType === 'developer') {
        
    }
 }

 async function getAllInactiveTasks(token) {
    let getInactiveTasksRequest = "http://localhost:8080/project_backend/rest/tasks/getAllSoftDeletedTasks";

    try {
        const response = await fetch(getInactiveTasksRequest, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                token: token
            }
        });

        if (response.ok) {
            const inactiveTasks = await response.json();
            listInactiveTasks(inactiveTasks);
        } else {
            console.error("Failed to fetch inactive tasks");
            return null;
        }
    } catch (error) {
        console.error("Error fetching inactive tasks:", error);
        return null;
    }
 }

 function listInactiveTasks(inactiveTasks) {
    const categoryTable = document.getElementById('tasks_table');

    inactiveTasks.forEach(inactiveTask => {
       
       const row = document.createElement('tr');
       row.classList.add('category_table_row');

       const titleCell = document.createElement('td');
       titleCell.textContent = inactiveTask.title;
       titleCell.style.textAlign = "center";

       const descriptionCell = document.createElement('td');
       descriptionCell.textContent = inactiveTask.description;
       descriptionCell.style.textAlign = "center";

       const categoryCell = document.createElement('td');
        categoryCell.textContent = inactiveTask.category.title;
        categoryCell.style.textAlign = "center";
        
        const initialDateCell = document.createElement('td');
        initialDateCell.textContent = inactiveTask.initialDate;
        initialDateCell.style.textAlign = "center";

        const finalDateCell = document.createElement('td');
        finalDateCell.textContent = inactiveTask.endDate;
        finalDateCell.style.textAlign = "center";

       const authorCell = document.createElement('td');
       authorCell.textContent = inactiveTask.author.username;
       authorCell.style.textAlign = "center";

       const editCell = document.createElement('td');
       editCell.style.textAlign = "center";
       

      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = "&#128465;";
      deleteButton.classList.add("delete_button");
      deleteButton.onclick = function(event) {
          hardDeleteTask(inactiveTask.id);
      };

      const restoreButton = document.createElement("button");
      restoreButton.innerHTML = "&#128260;";
      restoreButton.classList.add("restore_button");
        restoreButton.onclick = function(event) {
            restoreTask(inactiveTask.id);
        };

      if (sessionStorage.getItem('userType') === 'product_owner') {
            editCell.appendChild(deleteButton);
            editCell.appendChild(restoreButton);
      } else if (sessionStorage.getItem('userType') === 'scrum_master') {
            editCell.appendChild(restoreButton);
      }
      
      
       row.appendChild(titleCell);
       row.appendChild(descriptionCell);
       row.appendChild(categoryCell);
       
       row.appendChild(initialDateCell);
       row.appendChild(finalDateCell);
       row.appendChild(authorCell);
       row.appendChild(editCell);


       

       categoryTable.appendChild(row);
    });
}

async function hardDeleteTask(taskId) {
    const token = sessionStorage.getItem("token");
    const deleteTaskRequest = `http://localhost:8080/project_backend/rest/tasks/${taskId}/hardDeleteTask`;

    try {
        const response = await fetch(deleteTaskRequest, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                token: token
            }
        });

        if (response.ok) {
            
            window.location.reload();
        } else {
            const error = await response.json();
            console.error("Failed to delete task:", error);
        }
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}

async function restoreTask(taskId) {

    const token = sessionStorage.getItem("token");
    let deleteTaskRequest = `http://localhost:8080/project_backend/rest/tasks/${taskId}/softDelete`;
    try {
       const response = await fetch(deleteTaskRequest, {
          method: "PUT",
          headers: {
             Accept: "application/json",
             "Content-Type": "application/json",
             token: token
          }
       });
 
       if (response.ok) {
        window.location.reload();
       } else {
        const error = await response.json();
        console.error("Failed to delete task:", error);
       }
    
    } catch (error) {
       console.error("Error restoring task:", error);
    }
 }