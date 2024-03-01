
window.onload = function() {

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
      getAllCategories(token);
      addButtonsForUserType(role);
         
      }
   });

}


const title_txt = document.querySelector("#title");
const description_txt = document.querySelector("#description-task");
const category_element = document.querySelector("#category_element");
const initial_date = document.querySelector("#initial_date");
const end_date = document.querySelector("#end_dates");
const priority_array = document.querySelectorAll("#color_section input");
const task_type = sessionStorage.getItem("taskType");
const username = sessionStorage.getItem("username");
const pass = sessionStorage.getItem("pass");
let priority_checked = 100;

const token = sessionStorage.getItem("token");
const firstName_txt = document.querySelector("#user");
const user_img = document.querySelector("#user_img");

writeDate();

// Executa a função em intervalos de 1 segundo para atualizar a data
setInterval(writeDate, 1000);


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

       const createCategoryButton = document.createElement('button'); createCategoryButton.id = "listButton";
       createCategoryButton.classList.add("menu_item"); createCategoryButton.innerHTML = ".";
       createCategoryButton.textContent = 'Categories';
         createCategoryButton.addEventListener('click', function() {
            window.location.href = "createCategory.html";
            
         });

      menu.appendChild(listButton);
      menu.appendChild(createCategoryButton);
       
      
   } else if (userType === 'ScrumMaster') {
    

   } else if (userType === 'Developer') {
       
   }
}

async function getAllCategories(token) {
  
   const categoriesRequest = "http://localhost:8080/project_backend/rest/categories/getAllCategories";
   try {
       const response = await fetch(categoriesRequest, {
           method: "GET",
           headers: {
               Accept: "*/*",
               "Content-Type": "application/json",
               token: token
           }
       });

       if (response.ok) {
            const categories = await response.json();
           
            let selectElement = document.getElementById("category_element");

            categories.forEach(category => {
               
               let option = document.createElement("option");
               
               option.value = category.idCategory;
               
               option.text = category.title;
               selectElement.appendChild(option);
            });

       } else {

         const errorMessage = await response.text(); 
         console.error("Failed to fetch categories: " + errorMessage);
       }
   } catch (error) {
       console.error("Error fetching categories:", error);
   }
}




/*Se o título da tarefa for diferente de "" siginifica que esta existe e são impressos o título e descrição desta, 
é mostrado o botão de delete e o título da form é Task Edit, caso contrário os campos são deixados sem nada, o botão 
de delete não é mostrado e o título da forma é Task Creation*/
if (task_type == "edit") {
   let task_id = sessionStorage.getItem("task_id");
   document.querySelector("#task_creationTitle").textContent = "Task Edit";
   document.querySelector("#task_delete").style.display = "inline-block";
   getTask(token, task_id).then((result) => {
      title_txt.value = result.title;
      description_txt.value = result.description;
      initial_date.value = result.initialDate;
      category_element.value = result.category.title; //NAO ESTA A FUNCIONAR
      console.log("category: " + result.category.title);
      if (result.endDate != "9999-12-31") {
         end_date.value = result.endDate;
      }
      priority_checked = result.priority;
      for (let i = 0; i < priority_array.length; i++) {
         if (priority_array[i].value == priority_checked) {
            priority_array[i].checked = true;
            if (i == 0) {
               priority_color.style.backgroundColor = "#44ca4d";
            } else if (i == 1) {
               priority_color.style.backgroundColor = "#fcff2e";
            } else if (i == 2) {
               priority_color.style.backgroundColor = "#ff4d4d";
            }
         }
      }
   });
} else {
   document.querySelector("#task_delete").style.display = "none";
   document.querySelector("#task_save").style.width = "95%";
   document.querySelector("#task_creationTitle").textContent = "Task Creation";
   priority_color.style.backgroundColor = "#44ca4d";
   priority_array[0].checked = true;
}

/*Só é possível gravar a tarefa se esta contiver algum título. Caso o campo do título tenha algo escrito
vai haver uma verificação se esta tarefa está a ser criada ou editada. Caso esteja a ser criada, esta tarefa
é adicionada no fim da array de tarefas, caso esteja a ser editada é apenas mudado os valores dos atributos desta*/
document.querySelector("#task_save").addEventListener("click", async function () {
   if (title_txt.value != "") {
      if (!initial_date.value == "") {
         let current_date = new Date();
         const year = current_date.getFullYear();
         const month = (current_date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
         const day = current_date.getDate().toString().padStart(2, "0");

         current_date = `${year}-${month}-${day}`;

         if (initial_date.value >= current_date) {
            if (end_date.value == "") {
               end_date.value = "9999-12-31";
            }
            if (end_date.value > initial_date.value) {
               if (task_type == "create") {
                  for (let i = 0; i < priority_array.length; i++) {
                     if (priority_array[i].checked) {
                        console.log("prioridade: " + priority_array[i].value);
                        priority_checked = parseInt(priority_array[i].value);
                     }
                  }

                  await addTask(
                     title_txt.value,
                     description_txt.value,
                     initial_date.value,
                     end_date.value,
                     priority_checked,
                     category_element.value
                  );

                  window.location.href = "scrum.html";
               } else {
                  if (confirmEdit()) {
                     for (let i = 0; i < priority_array.length; i++) {
                        if (priority_array[i].checked) {
                           console.log("prioridade: " + priority_array[i].value);
                           priority_checked = priority_array[i].value;
                        }
                     }
                     //let task_id = sessionStorage.getItem("task_id");

                     await updateTask(
                        title_txt.value,
                        description_txt.value,
                        initial_date.value,
                        end_date.value,
                        priority_checked,
                        category_element.value
                     );

                     window.location.href = "scrum.html";
                  }
               }
            } else {
               alert("The end date must be greater than the initial date.");
            }
         }   else {
            alert("The initial date must be greater than the current date.");
         }
      } else {
         alert("You need to put the initial date.");
      }
   } else {
      alert("Need to put a task title.");
   }
});



for (let i = 0; i < priority_array.length; i++) {
   if (i == 0) {
      priority_array[i].addEventListener("click", function () {
         priority_color.style.backgroundColor = "#44ca4d";
      });
   } else if (i == 1) {
      priority_array[i].addEventListener("click", function () {
         priority_color.style.backgroundColor = "#fcff2e";
      });
   } else if (i == 2) {
      priority_array[i].addEventListener("click", function () {
         priority_color.style.backgroundColor = "#ff4d4d";
      });
   }
}
/*Botão para eliminar a tarefa, usando o método splice, que tem como argumentos de entrada o índice a partir do
qual queremos eliminar e quantos elementos queremos eliminar, neste caso vamos buscar o índice da tarefa a 
ser eliminada e como é apenas essa o segundo parâmetro é 1*/
document.querySelector("#task_delete").addEventListener("click", function () {
   if (confirmDelete()) {
      deleteTask(username, pass, sessionStorage.getItem("task_id"));
      window.location.href = "scrum.html";
   }
});

document.querySelector("#btn_scrumBoard").addEventListener("click", function () {
   if (confirmExit()) {
      window.location.href = "scrum.html";
   }
});
//Botão de fecho que direciona o utilizador para a página principal da aplicação
document.querySelector("#cancel").addEventListener("click", function () {
   if (confirmExit()) {
      window.location.href = "scrum.html";
   }
});

document.querySelector("header h1").addEventListener("click", function () {
   if (confirmExit()) {
      window.location.href = "scrum.html";
   }
});


//Função para confirmar delete
function confirmDelete() {
   return confirm("Are you sure you want to delete this?");
}

//Função para confirmar edit
function confirmEdit() {
   return confirm("Are you sure you want to edit this?");
}

//Função para confirmar sair da janela
function confirmExit() {
   return confirm("Are you sure you want to exit without saving first?");
}

// Função data e relógio

function writeDate() {
   const d = new Date();

   // Define o formato a mostrar
   let dateTimeString = d.toLocaleString("en-GB");
   dateTimeString = dateTimeString.replace(",", "&nbsp; &nbsp; &nbsp;");

   // Insere no HTML
   document.getElementById("date").innerHTML = dateTimeString;
}

async function addTask(title, description, initialDate, endDate, priority, idCategory) {

   const token = sessionStorage.getItem("token");
   let task = {
      title: title,
      description: description,
      initialDate: initialDate,
      endDate: endDate,
      priority: priority
   };
   await fetch("http://localhost:8080/project_backend/rest/tasks/createTask", {
      method: "POST",
      headers: {
         Accept: "*/*",
         "Content-Type": "application/json",
         token: token,
         categoryId: idCategory
         
      },
      body: JSON.stringify(task),
   }).then(function (response) {
      if (response.status == 200) {
         alert("task is added successfully :)");
      } else {
         alert("something went wrong :(");
      }
   });
}

async function updateTask(title, description, initialDate, endDate, priority, idCategory) {

   const token = sessionStorage.getItem("token");
   const task_id = sessionStorage.getItem("task_id");
   let task = {
      title: title,
      description: description,
      initialDate: initialDate,
      endDate: endDate,
      priority: priority
   };
   try {
      const response = await fetch("http://localhost:8080/project_backend/rest/tasks/updateTask", {
      method: "PUT",
      headers: {
         Accept: "*/*",
         "Content-Type": "application/json",
         token: token,
         categoryId: idCategory,
         taskId: task_id
         
      },
      body: JSON.stringify(task)

   });
   if (response.ok) {
      alert("task is updated successfully :)");

   } else {
      const errorMessage = await response.text(); 
      console.error("Failed to update: " + errorMessage);
   }
   } catch (error) {
      console.error("Error updating task:", error);
   }

}

async function getUser(username, pass) {
   let response = await fetch(
      "http://localhost:8080/project_backend/rest/users",

      {
         method: "GET",
         headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            username: username,
            pass: pass,
         },
      }
   );
   try {
      let user1 = await response.json();
      return user1;
   } catch (error) {
      return null;
   }
}

async function getTask(token, id) {

   let getTaskRequest = `http://localhost:8080/project_backend/rest/tasks/getTaskById/${id}`

   let response = await fetch(getTaskRequest, {

         method: "GET",
         headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            token, token
         },
      }
   );

   if (response.ok) {
      let task = await response.json();
      return task;
   } else {
      console.error("Failed to fetch task data");
      return null;
   }

}

async function deleteTask(username, pass, task_id) {
   await fetch("http://localhost:8080/project_backend/rest/tasks/" + task_id, {
      method: "DELETE",
      headers: {
         Accept: "*/*",
         "Content-Type": "application/json",
         username: username,
         pass: pass,
      },
   });
}
