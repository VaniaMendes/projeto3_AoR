const token = sessionStorage.getItem("token");
let user = null;
const user_photo = document.getElementById("user_img");
let users; // Variável para armazenar o array de usuários

getAllUsers(token).then((result) => {
       users=result;
       listUsers(users);
       listUsersForScrum(users);
       listInativeUsers(users);
    });


const role = sessionStorage.getItem("userType");
console.log(role);
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
   
   if (result == null) {
      window.location.href = "login.html";
   } else {
      user=result;
      user_img.src = user.imgURL;
      user_photo.src = user.imgURL;
      document.getElementById("user").textContent = user.firstName;  
      addButtonsForUserType(role);
       
   }
    
});

function addButtonsForUserType(role) {
    const menu = document.getElementById('menu'); 
    console.log(role);
 
    if (role === 'product_owner') {
        listUsers(users);
        
        const listButton = document.createElement('button'); listButton.id = "listButton";
        listButton.classList.add("menu_item"); listButton.innerHTML = ".";
        listButton.textContent = 'Active Users';
        listButton.addEventListener('click', function() {
           
            listUsers(users);
        });
        menu.appendChild(listButton);

         const listButton1 = document.createElement('button'); listButton1.id = "listButton";
         listButton1.classList.add("menu_item"); listButton1.innerHTML = ".";
         listButton1.textContent = 'Inactive Users';
         listButton1.addEventListener('click', function() {
         listInativeUsers(users);
         
    
            
        });
       
        menu.appendChild(listButton1);
       
       
    } else if (role === 'scrum_master') {
        listUsersForScrum(users);
        
    }
 }


document.getElementById("btn_scrumBoard").addEventListener("click", async function () {
    window.location.href = "scrum.html";
});

document.getElementById("logout").addEventListener("click", function () {
    if (confirm("Are you sure you want to logout?")) {
        sessionStorage.clear();
        window.location.href = "login.html";
     }
});

async function getAllUsers(token) {
    try {
        const response = await fetch("http://localhost:8080/project_backend/rest/users/all", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                token:token
            }
        });
 
        if (response.ok) {
            const users = await response.json();
            return users;
            
            
        } else {
            console.error("Failed to fetch user data");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
 }

 async function deleteUser(token, username) {


    try {
        const response = await fetch("http://localhost:8080/project_backend/rest/users/deleteUser", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Accept':   'application/json',
                "token":token,
                'username': username
            },
            
        });
 
        if (response.ok) {
        return true;  
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        return false;
    }
 }

 async function restoreUser(token, username) {
    try {
        const response = await fetch(`http://localhost:8080/project_backend/rest/users/restoreUser/${username}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "token": token
            }
        });

        if (response.ok) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error restoring user:", error);
        return false;
    }
}

 async function deleteUserForever(token, username) {


    try {
        const response = await fetch("http://localhost:8080/project_backend/rest/users/removeUser", {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Accept':   'application/json',
                "token":token,
                'username': username
            },
            
        });
 
        if (response.ok) {
        return true;  
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        return false;
    }
 }

 async function deleteUserTasks(token, username) {
    try {
        const response = await fetch(`http://localhost:8080/project_backend/rest/tasks/deleteTasksByUsername/${username}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                "token": token
            }
        });

        if (response.ok) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error deleting user tasks:", error);
        return false;
    }
}


 async function listUsers(users) {
    const tbody = document.querySelector('#users_table tbody');

    // Limpa o conteúdo existente da tabela
    tbody.innerHTML = '';

    // Preenche a tabela com os dados dos user
    for(const user of users) {
        if(user.active && user.username !== "admin" && user.username !== "deletedUser"){
        const row = document.createElement('tr');
        row.dataset.username = user.username;

        // Adiciona a imagem do user
        const imagemCell = document.createElement('td');
        const imagem = document.createElement('img');
        imagem.src = user.imgURL;
        imagem.alt = 'user.png';
        imagem.classList.add('imagem_user');
        imagemCell.appendChild(imagem);
        row.appendChild(imagemCell);

        // Adiciona o nome do user
        const nomeCell = document.createElement('td');
        nomeCell.textContent = user.firstName + " " + user.lastName;
        row.appendChild(nomeCell);

        // Adiciona o email do user
        const emailCell = document.createElement('td');
        emailCell.textContent = user.email;
        row.appendChild(emailCell);

        // Adiciona o número de telefone do user
        const telefoneCell = document.createElement('td');
        telefoneCell.textContent = user.phoneNumber;
        row.appendChild(telefoneCell);

        // Adiciona a função do user
        const funcaoCell = document.createElement('td');
        funcaoCell.textContent = getUserRole(user.typeOfUser);
        row.appendChild(funcaoCell);
        
        

        // Adiciona os botões de edição e exclusão na última coluna
        const acoesCell = document.createElement('td');
        const editButton = document.createElement("button");
        editButton.innerHTML = "&#9998;";
        editButton.classList.add("edit_button");
        editButton.onclick = function(event) {
            const userUsername = event.currentTarget.closest("[data-username]").dataset.username;
            sessionStorage.setItem("username", userUsername);
            window.location.href = 'edit_Profile_ProductOwner.html';
        };
        acoesCell.appendChild(editButton); // Adiciona o botão de edição à célula


        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "&#128465;";
        deleteButton.classList.add("delete_button");
        deleteButton.id="delete_button";
        deleteButton.onclick = function(event) {
            const userUsername = event.currentTarget.closest("[data-username]").dataset.username;

            if(user.active){
                if (confirm("Do you want to remove this user?")) {
                deleteUser(token, userUsername).then(result => {
                    
                    if (result) {
                        alert("Successfully removed user");
                        listUsers(users);
    
                    } else {
                        console.log("Failed to remove user");
                    }
                }).catch(error => {
                    console.error("Error remove user:", error);
                });
            }
            }
        };

        const deleteTasksButton = document.createElement("button");


        deleteTasksButton.innerHTML = "Delete Tasks"; //que icone usar???
        deleteTasksButton.style.border = '1px solid black';
        deleteTasksButton.classList.add("delete_button");
        deleteTasksButton.id="delete_Alltasks_button";
        deleteTasksButton.onclick = function(event) {
            const userUsername = event.currentTarget.closest("[data-username]").dataset.username;
            if(user.active){
                if (confirm("Do you want to remove all tasks from this user?")) {
                    if(deleteUserTasks(token, userUsername)) {
                        alert("Successfully removed all tasks from user");
                    } else {
                        alert("Failed to remove all tasks from user");
                    
                    }
                }
            }
        };




        acoesCell.appendChild(deleteButton); // Adiciona o botão de exclusão à célula
        acoesCell.appendChild(deleteTasksButton); // Adiciona o botão de exclusão à célula
        row.appendChild(acoesCell);

        // Adiciona a linha à tabela
        tbody.appendChild(row);
    }else{
        

    }
}

}
 
document.getElementById("btn_task").addEventListener('click', function() {
    window.location.href = 'registerProductOwner.html';
});


async function listUsersForScrum(users) {
    try {
        
        const tbody = document.querySelector('#users_table tbody');
        // Limpa o conteúdo existente da tabela
        tbody.innerHTML = '';

        // Preenche a tabela com os dados dos usuários
        for(const user of users) {
            if(user.active && user.username !== "admin" && user.username !== "deletedUser"){
                const row = document.createElement('tr');
                row.dataset.username = user.username;

                // Adiciona a imagem do usuário
                const imagemCell = document.createElement('td');
                const imagem = document.createElement('img');
                imagem.src = user.imgURL;
                imagem.alt = 'user.png';
                imagem.classList.add('imagem_user');
                imagemCell.appendChild(imagem);
                row.appendChild(imagemCell);

                // Adiciona o nome do usuário
                const nomeCell = document.createElement('td');
                nomeCell.textContent = user.firstName + " " + user.lastName;
                row.appendChild(nomeCell);

                // Adiciona o email do usuário
                const emailCell = document.createElement('td');
                emailCell.textContent = user.email;
                row.appendChild(emailCell);

                // Adiciona o número de telefone do usuário
                const telefoneCell = document.createElement('td');
                telefoneCell.textContent = user.phoneNumber;
                row.appendChild(telefoneCell);

                // Adiciona a função do usuário
                const funcaoCell = document.createElement('td');
                funcaoCell.textContent = getUserRole(user.typeOfUser);
                row.appendChild(funcaoCell);

                // Adiciona os botões de edição na última coluna
                const acoesCell = document.createElement('td');
                const editButton = document.createElement("button");
                editButton.innerHTML = "&#x1F4D6;";
                editButton.classList.add("edit_button");
                editButton.onclick = function(event) {
                    const userUsername = event.currentTarget.closest("[data-username]").dataset.username;
                    console.log(userUsername);
                    sessionStorage.setItem("username", userUsername);
                    window.location.href = 'edit_Profile_ProductOwner.html';
                };
                acoesCell.appendChild(editButton);
                
                row.appendChild(acoesCell);

                // Adiciona a linha à tabela
                tbody.appendChild(row);
            }
        }
    } catch (error) {
        console.error("Error listing users for scrum:", error);
    }
}

async function listInativeUsers(users) {
   
    const tbody = document.querySelector('#users_table tbody');

    // Limpa o conteúdo existente da tabela
    tbody.innerHTML = '';

    // Preenche a tabela com os dados dos usuários
    for(const user of users) {
        if(!user.active && user.username !== "admin" && user.username !== "deletedUser"){
            const row = document.createElement('tr');
            row.dataset.username = user.username;

            // Adiciona a imagem do usuário
            const imagemCell = document.createElement('td');
            const imagem = document.createElement('img');
            imagem.src = user.imgURL; // Supondo que cada usuário tenha uma propriedade "imagemUrl" com a URL da imagem
            imagem.alt = 'user.png';
            imagem.classList.add('imagem_user');
            imagemCell.appendChild(imagem);
            row.appendChild(imagemCell);

            // Adiciona o nome do usuário
            const nomeCell = document.createElement('td');
            nomeCell.textContent = user.firstName + " " + user.lastName;
            row.appendChild(nomeCell);

            // Adiciona o email do usuário
            const emailCell = document.createElement('td');
            emailCell.textContent = user.email;
            row.appendChild(emailCell);

            // Adiciona o número de telefone do usuário
            const telefoneCell = document.createElement('td');
            telefoneCell.textContent = user.phoneNumber;
            row.appendChild(telefoneCell);

            // Adiciona a função do usuário
            const funcaoCell = document.createElement('td');
            funcaoCell.textContent = getUserRole(user.typeOfUser);
            row.appendChild(funcaoCell);

            // Adiciona os botões de restaurar e excluir na última coluna
            const acoesCell = document.createElement('td');
            const restoreButton = document.createElement("button");
            restoreButton.innerHTML = "&#8634;";
            restoreButton.classList.add("restore_user");
            restoreButton.onclick = function(event) {
                const userUsername = event.currentTarget.closest("[data-username]").dataset.username;
                if(confirm("Do you want restore this user?")){
                    restoreUser(token, userUsername).then(result => {
                        if(result){
                            alert("Successfully restored user");
                            listInativeUsers(users);
                        }else{
                            alert("Failed to restore user");
                        }
                    });
                }
            };
            acoesCell.appendChild(restoreButton); // Adiciona o botão de restaurar à célula
            
            const deleteButton = document.createElement("button");
            deleteButton.innerHTML = "&#128465;";
            deleteButton.classList.add("delete_button");
            deleteButton.onclick = function(event) {
                const userUsername = event.currentTarget.closest("[data-username]").dataset.username;
                if(confirm("Do you want to delete this user permanently?")){
                    deleteUserForever(token, userUsername).then(result => {
                        console.log(userUsername);
                        if (result) {
                            alert("Successfully deleted user");
                            listInativeUsers(users);
                        } else {
                            console.log("Failed to delete user");
                        }
                    }).catch(error => {
                        console.error("Error deleting user:", error);
                    });
                }
            }
            acoesCell.appendChild(deleteButton); // Adiciona o botão de exclusão à célula
            
            row.appendChild(acoesCell);

            // Adiciona a linha à tabela
            tbody.appendChild(row);
        }
    }
}

  

function getUserRole(role) {
    switch (role) {
        case 'developer':
            return 'Developer';
        case 'scrum_master':
            return 'Scrum Master';
        case 'product_owner':
            return 'Product Owner';
        default:
            return 'Unknown Role';
    }
}

//Funcoes para ordenar as tabelas
function orderUsersByAtribute(users, atributo) {
    users.sort(function(a, b) {
        if (a[atributo] < b[atributo]) {
            return -1;
        }
        if (a[atributo] > b[atributo]) {
            return 1;
        }
        return 0;
    });
}


document.querySelector('#btnName').addEventListener('click', function(e) {
    orderUsersByAtribute(users, 'firstName');
    listUsersForScrum(users);
    listInativeUsers(users);

    if (role === 'scrum_master') {
        listUsersForScrum(users);
    }
    
});

document.getElementById('btnEmail').addEventListener('click', function(e) {
    orderUsersByAtribute(users, 'email');
    listUsersForScrum(users);
    listInativeUsers(users);
    if (role === 'scrum_master') {
        listUsersForScrum(users);
    }
   
});

document.getElementById('btnPhone').addEventListener('click', function(e) {
    orderUsersByAtribute(users, 'phoneNumber');
    listUsersForScrum(users);
    listInativeUsers(users);
    if (role === 'scrum_master') {
        listUsersForScrum(users);
    }
});

document.getElementById('btnRole').addEventListener('click', function(e){
    orderUsersByAtribute(users, 'typeOfUser');
    listUsersForScrum(users);
    listInativeUsers(users);
    if (role === 'scrum_master') {
        listUsersForScrum(users);
    }
});





 





