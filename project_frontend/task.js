const title_txt = document.querySelector("#title");
const description_txt = document.querySelector("#description");
const initial_date = document.querySelector("#initial_date");
const end_date = document.querySelector("#end_dates");
const priority_array = document.querySelectorAll("#color_section input");
const task_type = sessionStorage.getItem("taskType");
const username = sessionStorage.getItem("username");
const pass = sessionStorage.getItem("pass");
let priority_checked = 100;

writeDate();

// Executa a função em intervalos de 1 segundo para atualizar a data
setInterval(writeDate, 1000);

getUser(username, pass).then((result) => {
   if (result == null) {
      window.location.href = "login.html";
   } else {
      document.querySelector("#user").textContent = result.firstName;
      document.querySelector("#body_color").style.backgroundColor = result.background_color;
      document.querySelector("#user_img").src = result.imgURL;
   }
});

/*Se o título da tarefa for diferente de "" siginifica que esta existe e são impressos o título e descrição desta, 
é mostrado o botão de delete e o título da form é Task Edit, caso contrário os campos são deixados sem nada, o botão 
de delete não é mostrado e o título da forma é Task Creation*/
if (task_type == "edit") {
   let task_id = sessionStorage.getItem("task_id");
   document.querySelector("#task_creationTitle").textContent = "Task Edit";
   document.querySelector("#task_delete").style.display = "inline-block";
   getTask(username, pass, task_id).then((result) => {
      title_txt.value = result.title;
      description_txt.value = result.description;
      initial_date.value = result.initialDate;
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
document.querySelector("#task_save").addEventListener("click", function () {
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
                        priority_checked = parseInt(priority_array[i].value);
                     }
                  }

                  addTask(
                     username,
                     pass,
                     title_txt.value,
                     description_txt.value,
                     initial_date.value,
                     end_date.value,
                     priority_checked
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
                     let task_id = sessionStorage.getItem("task_id");

                     updateTask(
                        username,
                        pass,
                        task_id,
                        title_txt.value,
                        description_txt.value,
                        initial_date.value,
                        end_date.value,
                        priority_checked
                     );

                     window.location.href = "scrum.html";
                  }
               }
            } else {
               alert("The end date must be greater than the initial date.");
            }
         } else {
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

//Botão para direcionar o utlizador para a página de login
document.querySelector("#logout").addEventListener("click", function () {
   if (confirm("Are you sure you want to logout?")) {
      sessionStorage.clear();
      window.location.href = "login.html";
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

async function updateTask(username, pass, id, title, description, initialDate, endDate, priority) {
   await fetch("http://localhost:8080/project_backend/rest/tasks/update", {
      method: "PUT",
      headers: {
         Accept: "*/*",
         "Content-Type": "application/json",
         username: username,
         pass: pass,
         id: id,
         title: title,
         description: description,
         initialDate: initialDate,
         endDate: endDate,
         priority: priority,
      },
   }).then(function (response) {
      if (response.status == 200) {
         alert("Task was updated successfully.");
      } else {
         alert("Something went wrong.");
      }
   });
}

async function addTask(username_value, pass, title, description, initialDate, endDate, priority) {
   let task = {
      title: title,
      description: description,
      initialDate: initialDate,
      endDate: endDate,
      priority: priority,
   };
   await fetch("http://localhost:8080/project_backend/rest/tasks/create", {
      method: "POST",
      headers: {
         Accept: "*/*",
         "Content-Type": "application/json",
         username: username_value,
         pass: pass,
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

async function getTask(username, pass, id) {
   let response = await fetch(
      "http://localhost:8080/project_backend/rest/tasks/" + id,

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

   let task = await response.json();
   return task;
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
