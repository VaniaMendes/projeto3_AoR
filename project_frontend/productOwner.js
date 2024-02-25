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
      printListUsers(token);  
   }

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

 async function printListUsers(token) {
    const users = await getAllUsers(token);

    if (users !== null || users.length > 0) {
        const activeUsers = users.filter(user => user.isActive); // Filtra apenas os usuários ativos

    const usersContainer = document.querySelector('.users_list');
    const userListElement = document.createElement('ul');

    activeUsers.forEach(user => {
        const userListItem = document.createElement('li');
        userListItem.textContent = user.firstName;
        userListElement.appendChild(userListItem);
    });

    usersContainer.appendChild(userListElement);

} else {
        console.error("Failed to fetch user data or empty user list");
    }
}


