const token = sessionStorage.getItem("token");
let user = null;
const user_photo = document.getElementById("user_img");


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
       
   }
    printListUsers(token); 
});


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
            console.log(users);
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
    const data = { username: username };
    try {
        const response = await fetch("http://localhost:8080/project_backend/rest/users/deleteUser", {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                "token":token
            },
            body: JSON.stringify(data)
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


 async function printListUsers(token) {
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
                const fullName = (user.firstName + " " + user.lastName).toUpperCase();
                const cardElement = createCardElement(user, token);              
                usersListElement.appendChild(cardElement);
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
    console.log(user);
    // Cria a div principal para o cartão do usuário
    const cardElement = document.createElement("div");
    cardElement.classList.add("user_card");
    cardElement.dataset.username = user.username;
   

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
    editButton.innerHTML = "&#9998;";
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
        if (confirm("Do you want to delete this user?")) {
        deleteUser(token, userUsername).then(result => {
            console.log(result);
            if (result) {
                printListUsers(token);
            } else {
                console.log("Failed to delete user");
            }
        }).catch(error => {
            console.error("Error deleting user:", error);
        });
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


 

 





    