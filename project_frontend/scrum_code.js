
const firstName_txt = document.querySelector("#user");
//const retros = JSON.parse(localStorage.getItem("retros")) || [];
const user_img = document.querySelector("#user_img");
const column1 = document.querySelector("#column1");
const column2 = document.querySelector("#column2");
const column3 = document.querySelector("#column3");
const backgroundScrum = document.querySelector("#background");
const taskLists = document.querySelectorAll(".task_list");
let user = null;

const LOW = 100;
const MEDIUM = 200;
const HIGH = 300;

const token = sessionStorage.getItem("token");



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
getUserByToken(token).then((result) => {
   user = result;
   if (user == null) {
      window.location.href = "login.html";
   } else {
      firstName_txt.textContent = user.firstName;
      const role = user.typeOfUSer;
      sessionStorage.setItem('userType', role);
     

      if(user.imgURL){
         user_img.src = user.imgURL;
      }else{user_img.src = 'user.png';
   }
   addButtonsForUserType(role);
      
   }
});


function addButtonsForUserType(userType) {
   const menu = document.getElementById('menu'); //  elemento com o ID 'menu' onde os botões serão adicionados

   if (userType === 'ProductOwner') {
       
       // Adicionar botão para consultar lista de todos os usuários
       const listButton = document.createElement('button'); listButton.id = "listButton";
       listButton.classList.add("menu_item"); listButton.innerHTML = ".";
       listButton.textContent = 'All Users';
       listButton.addEventListener('click', function() {
         window.location.href = "productOwner.html";
           
       });
       menu.appendChild(listButton);
       
      
   } else if (userType === 'ScrumMaster') {
    

   } else if (userType === 'Developer') {
       
   }
}


writeDate();

//Executa a função em intervalos de 1 segundo para atualizar a data
setInterval(writeDate, 1000);

document.querySelector("#logout").addEventListener("click", function () {
   if (confirm("Are you sure you want to logout?")) {
      sessionStorage.clear();
      window.location.href = "login.html";
   }
});

//Event Listenner para o botao EditProfile

document.querySelector("#btn_edit").addEventListener("click", function () {
   window.location.href = "edit_profile.html";
});

/*document.querySelector("#btn_sprint").addEventListener("click", function () {
   window.location.href = "retrospective.html";
});*/

/*Evento de clicar no botão "+ New Task" da aplicação. Aqui é criado um objeto task. Para ser utilizado
na página task-html. Nessa página há uma condição que ao verificar que a task não tem título 
vai ser apresentada a form de criação e não a de edição */
document.querySelector("#btn_task").addEventListener("click", function () {
   sessionStorage.setItem("taskType", "create");
   window.location.href = "task.html";
});

/*Ciclo for para adicionar a todas as colunas o evento dragover. Este evento vai verificar qual o elemento 
que tem a class drag e quando este elemento passar por cima da coluna vai fazer o append child desta div nela
e vai mudar o atributo column do objeto task para quando a página for atualizada as tarefas serem impressas
na coluna em que estavam anteriormente*/

/*Sempre que a página é fechada ou quando o utilizador muda de página a array das tarefas é guardada em localStorage */

window.addEventListener("beforeunload", function () {
   localStorage.setItem("tasks", JSON.stringify(tasks));
});

document.querySelector("#modal_cancel").addEventListener("click", function () {
   document.querySelector("#modal").style.visibility = "hidden";
   document.querySelector("#background").style.visibility = "hidden";
});

document.querySelector("#background").addEventListener("click", function () {
   document.querySelector("#modal").style.visibility = "hidden";
   document.querySelector("#background").style.visibility = "hidden";
   document.querySelector("#modal_settings").style.visibility = "hidden";
});



/*Função para fazer a impressão inicial das tarefas, quando a página é inicializada. As tarefas vão ser impressas
nas colunas em que estavam anteriormente a partir do atributo column do objeto task. Também são adicionados todos 
os eventos dos botões de delete e dos botões de edição das tarefas */
function printTasks(tasks) {
   console.log(tasks);
   document.querySelector("#toDo").innerHTML = "";
   document.querySelector("#doing").innerHTML = "";
   document.querySelector("#done").innerHTML = "";
   orderTasks(tasks);
   for (let i = 0; i < tasks.length; i++) {
      const task_div = document.createElement("div");
      task_div.id = tasks[i].id;
      task_div.classList.add("task");
      taskCreationAddEvents(task_div, tasks);
      task_div.setAttribute("draggable", "true");

      if (tasks[i].priority == LOW) {
         task_div.style.backgroundColor = "#44ca4d";
      } else if (tasks[i].priority == MEDIUM) {
         task_div.style.backgroundColor = "#fcff2e";
      } else if (tasks[i].priority == HIGH) {
         task_div.style.backgroundColor = "#ff4d4d";
      }

      task_div.style.color = fontColorRGB(task_div.style.backgroundColor);

      const task_title = document.createElement("div");
      task_title.classList.add("task_title");
      task_title.textContent = tasks[i].title;
      task_div.appendChild(task_title);

      console.log(tasks[i].endDate);

      let date_now = new Date();
      date_now = date_now.getTime();
      let endDate = new Date(tasks[i].endDate);
      endDate = endDate.getTime();
      let daysDiferences = endDate - date_now;
      daysDiferences = daysDiferences / (1000 * 60 * 60 * 24);
      daysDiferences = Math.round(daysDiferences);
      if (daysDiferences > 999) daysDiferences = 999;
      const task_day = document.createElement("div");
      task_day.classList.add("task_day");
      if (tasks[i].endDate != "9999-12-31") task_day.textContent = daysDiferences;
      task_div.appendChild(task_day);

      const task_btn = document.createElement("button");
      task_btn.innerHTML = "&#9998;";
      task_btn.classList.add("task_btn");
      task_btn.style.color = fontColorRGB(task_div.style.backgroundColor);

      addEventsBeforeDrag(task_btn, task_div);

      const task_btnDelete = document.createElement("button");
      task_btnDelete.innerHTML = "&#128465;";
      task_btnDelete.classList.add("delete_btn");
      task_btnDelete.style.color = fontColorRGB(task_div.style.backgroundColor);

      addEventsBeforeDrag(task_btnDelete, task_div);

      task_div.appendChild(task_btnDelete);
      task_div.appendChild(task_btn);

      if (tasks[i].state == "toDo") {
         document.querySelector("#toDo").appendChild(task_div);
      } else if (tasks[i].state == "doing") {
         document.querySelector("#doing").appendChild(task_div);
      } else if (tasks[i].state == "done") {
         document.querySelector("#done").appendChild(task_div);
      }
   }
   const delete_btns = document.querySelectorAll(".delete_btn");
   const buttons = document.querySelectorAll(".task_btn");

   for (let btn of buttons) {
      btn.addEventListener("click", function () {
         let validate = false;
         for (let i = 0; i < tasks.length && validate == false; i++) {
            if (tasks[i].id == this.parentNode.id) {
               sessionStorage.setItem("taskType", "edit");
               sessionStorage.setItem("task_id", this.parentNode.id);
               validate = true;
            }
         }
         window.location.href = "task.html";
      });
   }

   for (let btn of delete_btns) {
      btn.addEventListener("click", function () {
         if (confirm("Are you sure you want to delete this task?")) {
            for (let i = 0; i < tasks.length; i++) {
               if (tasks[i].id == this.parentNode.id) {
                  deleteTask(username, pass, tasks[i].id);
                  this.parentNode.remove();
               }
            }
         }
      });
   }
}

/*Função que adiciona todos os eventos a cada div das tarefas. */
function taskCreationAddEvents(task_div, tasks) {
   /*Evento que abre a modal que vai mostrar o título e a descrição da tarefa */
   task_div.addEventListener("dblclick", function () {
      for (let i = 0; i < tasks.length; i++) {
         if (tasks[i].id == task_div.id) {
            const task_sel = tasks[i];
            document.querySelector("#modal_title").innerHTML = task_sel.title;
            document.querySelector("#modal_description").innerHTML = task_sel.description;
            document.querySelector("#modal_startDate").innerHTML = task_sel.initialDate;
            if (task_sel.endDate == "9999-12-31") document.querySelector("#modal_endDate").innerHTML = "";
            else document.querySelector("#modal_endDate").innerHTML = task_sel.endDate;
            document.querySelector("#modal").style.visibility = "visible";
            document.querySelector("#background").style.visibility = "visible";
         }
      }
   });

   /*Evento que muda a cor da div da tarefa quando esta começa a ser arrastada. Também adiciona a class drag a esta div.
   Guarda-se a cor original da div para podermos ir buscá-la quando esta deixar de ser arrastada */
   task_div.addEventListener("dragstart", function () {
      sessionStorage.setItem("drag_backgroundColor", task_div.style.backgroundColor);
      task_div.classList.add("drag");
      task_div.style.backgroundColor = "#bebebe";
      task_div.style.color = "#bebebe";
   });

   /*Quando a div deixa de ser arrastada é tirada da array das tasks e voltada a ser adicionada no fim desta array. 
   Assim quando a página é atualizada as tarefas são mostradas exatamente pela mesma ordem que o utilizador deixou. 
   Também é removida a class drag da div as cores desta voltam às originais antes dela começar a ser arrastada */
   task_div.addEventListener("dragend", function () {
      task_div.classList.remove("drag");
      getTasks(username, pass).then((result) => {
         tasks = result;
         printTasks(tasks);
      });

      task_div.style.backgroundColor = sessionStorage.getItem("drag_backgroundColor");
      task_div.style.color = fontColorRGB(sessionStorage.getItem("drag_backgroundColor"));
   });

   /*Os botões de delete e de edit das tasks apenas são mostrados quando o cursor passa por cima da div*/

   task_div.addEventListener("mouseenter", function () {
      task_div.childNodes[2].style.visibility = "visible";
      task_div.childNodes[3].style.visibility = "visible";
   });
   task_div.addEventListener("mouseleave", function () {
      task_div.childNodes[2].style.visibility = "hidden";
      task_div.childNodes[3].style.visibility = "hidden";
   });
}

/*Função para adicionar os eventos de hover e active ao butão btn consoante a cor da task_div */
function addEventsBeforeDrag(btn, task_div) {
   btn.addEventListener("mouseenter", function () {
      const color = rgbColor(task_div.style.backgroundColor, -15, -15, -15);
      btn.style.backgroundColor = color;
   });

   btn.addEventListener("mouseleave", function () {
      btn.style.backgroundColor = task_div.style.backgroundColor;
   });

   btn.addEventListener("mousedown", function () {
      const color = rgbColor(task_div.style.backgroundColor, -30, -30, -30);
      this.style.backgroundColor = color;
   });
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

async function getTasks(username, pass) {
   let response = await fetch("http://localhost:8080/project_backend/rest/tasks", {
      method: "GET",
      headers: {
         Accept: "*/*",
         "Content-Type": "application/json",
         username: username,
         pass: pass,
      },
   });

   let tasks = await response.json();
   return tasks;
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

async function updateTaskState(username, pass, id, state) {
   await fetch("http://localhost:8080/project_backend/rest/tasks/state", {
      method: "PUT",
      headers: {
         Accept: "*/*",
         "Content-Type": "application/json",
         username: username,
         pass: pass,
         id: id,
         state: state,
      },
   });
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

function orderTasks(tasks) {
   tasks.sort((a, b) => {
      if (a.priority > b.priority) {
         return -1;
      } else if (a.priority < b.priority) {
         return 1;
      }

      if (a.initialDate < b.initialDate) {
         return -1;
      } else if (a.initialDate > b.initialDate) {
         return 1;
      }

      if (a.endDate < b.endDate) {
         return -1;
      } else if (a.endDate > b.endDate) {
         return 1;
      }

      return 0;
   });

   return tasks;
}

//////CORES///////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

/*Evento de click no botão apply que vai buscar as cores escolhidas pelo utilizador e vai aplicar à aplicação.
Estas cores ficam guardadas em localStorage para quando o utilizador mudar de página as cores se manterem*/

document.querySelector("#apply").addEventListener("click", function () {
   const background_color = document.querySelector("#background_color").value;
   const toDo_color = document.querySelector("#toDo_color").value;
   const doing_color = document.querySelector("#doing_color").value;
   const done_color = document.querySelector("#done_color").value;

   saveColors(username, pass, background_color, toDo_color, doing_color, done_color);

   document.querySelector("#background").style.visibility = "hidden";
   document.querySelector("#modal_settings").style.visibility = "hidden";
});

document.querySelector("#cancel_settings").addEventListener("click", function () {
   document.querySelector("#background").style.visibility = "hidden";
   document.querySelector("#modal_settings").style.visibility = "hidden";
});

document.querySelector("#modal_cancel2").addEventListener("click", function () {
   document.querySelector("#background").style.visibility = "hidden";
   document.querySelector("#modal_settings").style.visibility = "hidden";
});

//Este evento ao ser acionado muda todas as cores da aplicação para as cores originais desta
document.querySelector("#reset_settings").addEventListener("click", function () {
   saveColors(username, pass, "#172b4c", "#f1f2f4", "#f1f2f4", "#f1f2f4");

   document.querySelector("#background").style.visibility = "hidden";
   document.querySelector("#modal_settings").style.visibility = "hidden";
});

/*Função para colorir a aplicação, em que como argumentos temos a cor para o background da aplicação, a cor para a coluna
do To Do, a cor para a coluna Doing e a cor para a coluna Done, respetivamente. As fonts das letras presentes em cada uma
das colunas também vai atualizar consoante a cor da coluna*/

function colorizeApp(backgroundColor, toDoColor, doingColor, doneColor) {
   document.querySelector("#body_color").style.backgroundColor = backgroundColor;
   document.querySelector("#column1").style.backgroundColor = toDoColor;
   document.querySelector("#column2").style.backgroundColor = doingColor;
   document.querySelector("#column3").style.backgroundColor = doneColor;
   document.querySelector("#btn_task").style.backgroundColor = toDoColor;
   document.querySelector("#column1 .title").style.color = fontColor(toDoColor);
   document.querySelector("#column2 .title").style.color = fontColor(doingColor);
   document.querySelector("#column3 .title").style.color = fontColor(doneColor);
   document.querySelector("#btn_task").style.color = fontColor(toDoColor);

   document.querySelector("#btn_task").addEventListener("mouseenter", function () {
      let color = hexToRGB(toDoColor, -15, -15, -15);

      this.style.backgroundColor = color;
   });

   document.querySelector("#btn_task").addEventListener("mouseleave", function () {
      this.style.backgroundColor = toDoColor;
   });

   document.querySelector("#btn_task").addEventListener("mousedown", function () {
      let color = hexToRGB(toDoColor, -30, -30, -30);

      this.style.backgroundColor = color;
   });
}

async function saveColors(username, pass, background_color, toDo_color, doing_color, done_color) {
   await fetch("http://localhost:8080/project_backend/rest/users", {
      method: "PUT",
      headers: {
         Accept: "*/*",
         "Content-Type": "application/json",
         username: username,
         pass: pass,
         background_color: background_color,
         toDo_color: toDo_color,
         doing_color: doing_color,
         done_color: done_color,
      },
   }).then(function (response) {
      if (response.status == 404) {
         alert("You don't have authorization to make changes");
      } else if (response.status == 200) {
         colorizeApp(background_color, toDo_color, doing_color, done_color);
         alert("Colors were updated");
      } else alert("Something went wrong");
   });
}
/*Função para transformar uma cor Hex em RGB, com o qual é mais fácil fazer contas. Esta função existe apenas
porque as cores em hover e active dos butões são calculadas a partir da cor original destes. 
Apenas aceita cores em formato hexadecimal*/

function hexToRGB(hexColor, redChange, greenChange, blueChange) {
   /*Esta linha serve para verificar se a cor é do tipo hexadecimal e extrai os componentes RGB em array. 
 No fundo vai ver se os caracteres coincidem entre a até f ou se é um número décimal para Red, Green e Blue. No fim dá um array em rgb
 onde o primeiro índice corresponde ao componente vermelho, o segundo ao verde e o terceiro ao azul*/

   var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);

   var red = parseInt(rgb[1], 16);
   var green = parseInt(rgb[2], 16);
   var blue = parseInt(rgb[3], 16);

   red = red + redChange;
   green = green + greenChange;
   blue = blue + blueChange;

   const color = "rgb(" + red + ", " + green + ", " + blue + ")";

   return color;
}

/*Função para calcular a cor das letras consoante a sua cor de fundo. Dá sempre uma cor perto do preto ou uma cor perto do branco
apenas aceita cores em formato Hexadecimal*/

function fontColor(hexColor) {
   var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
   var red = parseInt(rgb[1], 16);
   var green = parseInt(rgb[2], 16);
   var blue = parseInt(rgb[3], 16);

   if (red * 0.299 + green * 0.587 + blue * 0.114 > 125) {
      return "rgb(14, 14, 14)";
   } else {
      return "rgb(250, 250, 250)";
   }
}

/*Função para calcular a cor das letras consoante a sua cor de fundo. Dá sempre uma cor perto do preto ou uma cor perto do branco
apenas aceita cores em formato RGB*/

function fontColorRGB(RGBcolor) {
   var colorsOnly = RGBcolor.split(")"); //gives "rgba(111,222,333,0.5" at index 0

   var colorsOnly = colorsOnly[0].split("("); //gives "111,222,333,0.5 at index 1

   var colorsOnly = colorsOnly[1].split(",");

   var red = colorsOnly[0].split(",");
   var green = colorsOnly[1].split(",");
   var blue = colorsOnly[2].split(",");

   if (red * 0.299 + green * 0.587 + blue * 0.114 > 125) {
      return "rgb(14, 14, 14)";
   } else {
      return "rgb(250, 250, 250)";
   }
}

/*Função que calcula as cores para hover e active dos butões. Apenas aceita como parâmetro de entradacores em formato RGB*/

function rgbColor(RGBcolor, redChange, greenChange, blueChange) {
   var colorsOnly = RGBcolor.split(")");
   var colorsOnly = colorsOnly[0].split("(");
   var colorsOnly = colorsOnly[1].split(",");

   var red = parseInt(colorsOnly[0].split(","));
   var green = parseInt(colorsOnly[1].split(","));
   var blue = parseInt(colorsOnly[2].split(","));

   red = red + redChange;
   green = green + greenChange;
   blue = blue + blueChange;

   const colorRGB = "rgb(" + red + ", " + green + ", " + blue + ")";

   return colorRGB;
}

function rgbStringToHex(rgbString) {
   // Extract the numeric values from the RGB string
   const rgbValues = rgbString.match(/\d+/g);

   if (!rgbValues || rgbValues.length !== 3) {
      // Invalid RGB string format
      return null;
   }

   // Convert each component to its hexadecimal representation
   const redHex = parseInt(rgbValues[0], 10).toString(16).padStart(2, "0");
   const greenHex = parseInt(rgbValues[1], 10).toString(16).padStart(2, "0");
   const blueHex = parseInt(rgbValues[2], 10).toString(16).padStart(2, "0");

   // Concatenate the hex values and return the result
   return `#${redHex}${greenHex}${blueHex}`;
}

/*module.exports = {
   getUser,
};*/
