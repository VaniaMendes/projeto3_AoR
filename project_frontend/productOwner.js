const token = sessionStorage.getItem("token");
let user = null;
const user_photo = document.getElementById("user_img");

const role = sessionStorage.getItem("role");
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
 
    if (role === 'product_owner') {
        printListUsers(token, createCardElement);
        
        const listButton = document.createElement('button'); listButton.id = "listButton";
        listButton.classList.add("menu_item"); listButton.innerHTML = ".";
        listButton.textContent = 'Active Users';
        listButton.addEventListener('click', function() {
         printListUsers(token, createCardElement);
            
        });
        menu.appendChild(listButton);

         const listButton1 = document.createElement('button'); listButton1.id = "listButton";
         listButton1.classList.add("menu_item"); listButton1.innerHTML = ".";
         listButton1.textContent = 'Inactive Users';
         listButton1.addEventListener('click', function() {
         printInativeUsers(token, createCardElement);
     
            
        });
       
        menu.appendChild(listButton1);
        btn_task.style.visibility="visible";
       
    } else if (role === 'scrum_master') {
        printListUsers(token, createCardElementForScrum);
        const listButton = document.createElement('button'); listButton.id = "listButton";
        listButton.classList.add("menu_item"); listButton.innerHTML = ".";
        listButton.textContent = 'Active Users';
        listButton.addEventListener('click', function() {
         printListUsers(token, createCardElementForScrum);
            
        });
        menu.appendChild(listButton);
        btn_task.style.visibility="hidden";
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

 async function printListUsers(token, cardHeaderName) {
    try {
        const users = await getAllUsers(token);
        const usersListElement = document.querySelector('.user_list');
        
        if(users !== null && (user.token != token )) { 
            users.sort((a, b) => {
                const nameA = a.firstName.toUpperCase();
                const nameB = b.firstName.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            }); 
            
            usersListElement.innerHTML = '';
            
            for (const user of users) {
                if(user.active){
                const fullName = (user.firstName + " " + user.lastName).toUpperCase();
                const cardElement = cardHeaderName(user, token);              
                usersListElement.appendChild(cardElement);
            } 
        }         
            // Após imprimir os usuários, adiciona os ouvintes de evento aos cartões
            addCardEventListeners();
        }
    } catch (error) {
        console.error('Error printing user list:', error);
    }
}

async function printInativeUsers(token) {
    try {
        const users = await getAllUsers(token);
        const usersListElement = document.querySelector('.user_list');
        
        if(users !== null) { 
            users.sort((a, b) => {
                const nameA = a.firstName.toUpperCase();
                const nameB = b.firstName.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            }); 
            
            usersListElement.innerHTML = '';
            
            for (const user of users) {
                if(!user.active && (user.token != token )){
                const fullName = (user.firstName + " " + user.lastName).toUpperCase();
                const cardElement = createCardElement(user, token);              
                usersListElement.appendChild(cardElement);
            } 
        }         
            // Após imprimir os usuários, adiciona os ouvintes de evento aos cartões
            addCardEventListeners();
        }
    } catch (error) {
        console.error('Error printing user list:', error);
    }
}

// Função para mostrar os botões quando o mouse passa sobre o cartão
function showButtons(event) {
    const buttonDiv = event.currentTarget.querySelector(".button_container");
    buttonDiv.style.visibility = "visible";
}

// Função para ocultar os botões quando o mouse sai do cartão
function hideButtons(event) {
    const buttonDiv = event.currentTarget.querySelector(".button_container");
    buttonDiv.style.visibility = "hidden";
}

// Adiciona ouvintes de evento aos cartões do usuário
function addCardEventListeners() {
    const userCards = document.querySelectorAll(".user_card");
    userCards.forEach(function(card) {
        card.addEventListener("mouseover", showButtons);
        card.addEventListener("mouseout", hideButtons);
        // Oculta os botões inicialmente
        hideButtons({ currentTarget: card });
    });
}


function createCardElement(user, token) {
    // Cria a div principal para o cartão do usuário
    const cardElement = document.createElement("div");
    cardElement.classList.add("user_card");
    cardElement.dataset.username = user.username;

    if(user.active){
        cardElement.classList.add("active_user");
    }else{
        cardElement.classList.add("inactive_user");
    }
   

    // Cria a div para o cabeçalho do cartão
    const cardHeaderElement = document.createElement("div");
    cardHeaderElement.classList.add("card_header");
    const fullName = (user.firstName + " " + user.lastName).toUpperCase();
    cardHeaderElement.textContent = fullName;
    

    // Cria a div para os botões
    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("button_container");

    // Botão de edição
    const editButton = document.createElement("button");
    editButton.innerHTML = "&#128214;";
    editButton.classList.add("edit_button");
    editButton.addEventListener("click", function (event) {
        const userUsername = event.currentTarget.closest("[data-username]").dataset.username;
        console.log(userUsername);
        sessionStorage.setItem("username", userUsername);
        window.location.href = 'edit_Profile_ProductOwner.html';
    });

    // Botão de delete
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "&#128465;";
    deleteButton.classList.add("delete_button");
    deleteButton.addEventListener("click", function (event) {

        const userUsername = event.currentTarget.closest("[data-username]").dataset.username;

        if(user.active){
            if (confirm("Do you want to remove this user?")) {
            deleteUser(token, userUsername).then(result => {
                console.log(userUsername);
                if (result) {
                    alert("Successfully removed user");
                    printListUsers(token);
                } else {
                    console.log("Failed to remove user");
                }
            }).catch(error => {
                console.error("Error remove user:", error);
            });
        }
    }else {

        if(confirm("Do you want to delete this user permanently?")){
        deleteUserForever(token, userUsername).then(result => {
            console.log(userUsername);
            if (result) {
                alert("Successfully deleted user");
                printInativeUsers(token);
            } else {
                console.log("Failed to delete user");
            }
        }).catch(error => {
            console.error("Error deleting user:", error);
        });

        }
    }

    });

    // Adiciona os botões à div de botões
    buttonDiv.appendChild(editButton);
    buttonDiv.appendChild(deleteButton);

    // Adiciona a div de botões ao cabeçalho do cartão
    cardHeaderElement.appendChild(buttonDiv);

    // Adiciona o cabeçalho ao cartão principal
    cardElement.appendChild(cardHeaderElement);

    // Retorna o cartão completo
    return cardElement;
}
  document.getElementById("btn_task").addEventListener("click", async function () {
    window.location.href = "registerProductOwner.html";
  });

  function createCardElementForScrum(user, token) {
    // Cria a div principal para o cartão do usuário
    const cardElement = document.createElement("div");
    cardElement.classList.add("user_card");
    cardElement.dataset.username = user.username;

    if(user.active){
        cardElement.classList.add("active_user");
    }else{
        cardElement.classList.add("inactive_user");
    }

    // Cria a div para o cabeçalho do cartão
    const cardHeaderElement = document.createElement("div");
    cardHeaderElement.classList.add("card_header");
    const fullName = (user.firstName + " " + user.lastName).toUpperCase();
    cardHeaderElement.textContent = fullName;
    
    // Botão de edição
    const editButton = document.createElement("button");
    editButton.innerHTML = "&#128214;";
    editButton.classList.add("edit_button");
    editButton.addEventListener("click", function (event) {
        const userUsername = event.currentTarget.closest("[data-username]").dataset.username;
        console.log(userUsername);
        sessionStorage.setItem("username", userUsername);
        window.location.href = 'edit_Profile_ProductOwner.html';
    });
    
    cardHeaderElement.appendChild(editButton);

    // Adiciona o cabeçalho ao cartão principal
    cardElement.appendChild(cardHeaderElement);

    // Retorna o cartão completo
    return cardElement;
}
  


 

 





    