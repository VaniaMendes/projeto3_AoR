//Executa a função em intervalos de 1 segundo para atualizar a data
writeDate();
setInterval(writeDate, 1000);

const token = sessionStorage.getItem("token");
const username = sessionStorage.getItem("username");
const role = sessionStorage.getItem("userType");

console.log(token);

console.log(username);
console.log(role);

let user = null;

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
      document.getElementById("user_img").src = user.imgURL;
      document.getElementById("user").textContent = user.firstName; 
   }

});

async function getUserByUsername(token, username) {
    try {

        const response = await fetch("http://localhost:8080/project_backend/rest/users/user", {

        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept':   'application/json',
            "token":token,
            'username': username
        },

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
 
 getUserByUsername(token, username).then((result) => {
    
    if (result == null) {

       alert("User does not exist");
    
    } else {
       user=result;
       document.getElementById("user_photo").src = user.imgURL;
       document.getElementById("edit_firstName").placeholder = user.firstName;
       document.getElementById("edit_URL").placeholder = user.imgURL;
       document.getElementById("edit_lastName").placeholder = user.lastName;
       document.getElementById("edit_email").placeholder = user.email;
       document.getElementById("edit_phone").placeholder = user.phoneNumber;
       document.getElementById("user_photo").placeholder = user.imgURL;
       document.getElementById("username_edit").textContent = user.username;

       // Preencher o tipo de usuário no elemento select
       const userTypeSelect = document.getElementById("edit_element");
       userTypeSelect.value = user.typeOfUser.toLowerCase(); // Garante que o valor corresponde ao valor no objeto user
   
       addButtonsForUserType(role);
     }

    });

    function addButtonsForUserType(role) {
      const menu = document.getElementById('menu'); //  elemento com o ID 'menu' onde os botões serão adicionados
   
      if (role === 'product_owner') {
         document.getElementById("btn-save").style.visibility="visible";
        
      } else if (role === 'scrum_master') {
         document.getElementById("edit_firstName").disabled = true;
         document.getElementById("edit_URL").disabled = true;
         document.getElementById("edit_lastName").disabled = true;
         document.getElementById("edit_email").disabled = true;
         document.getElementById("edit_phone").disabled = true;
         document.getElementById("edit_element").disabled = true;
       

         document.getElementById("btn-save").style.visibility="hidden";
      }
   }

document.querySelector("#btn_scrumBoard").addEventListener("click", function () {
   window.location.href = "scrum.html";
});


//action Listenner para o botao Cancel
document.getElementById("btn_cancel").addEventListener("click", function () {

   window.location.href = "productOwner.html";
});



// 
document.querySelector("header h1").addEventListener("click", function () {
   window.location.href = "scrum.html";
});

// Adiciona um evento de alteração para cada campo de entrada
document.getElementById("edit_element").addEventListener("change", function () {
   typeOfUser = true;
});

document.getElementById("edit_email").addEventListener("change", function () {
   emailEdited = true;
});

document.getElementById("edit_firstName").addEventListener("change", function () {
   firstNameEdited = true;
});

document.getElementById("edit_lastName").addEventListener("change", function () {
   lastNameEdited = true;
});

document.getElementById("edit_phone").addEventListener("change", function () {
   phoneEdited = true;
});

document.getElementById("edit_URL").addEventListener("change", function () {
   photoEdited = true;
});

function isValidURL(url) {
   const imageExtensions = /\.(jpeg|jpg|gif|png|bmp)$/i;
   if (imageExtensions.test(url) == true) {
      try {
         new URL(url);
         return true;
      } catch {
         return false;
      }
   } else return false;
}

function writeDate() {
   const d = new Date();

   // Define o formato a mostrar
   let dateTimeString = d.toLocaleString("en-GB");
   dateTimeString = dateTimeString.replace(",", "&nbsp; &nbsp; &nbsp;");

   // Insere no HTML
   document.getElementById("date").innerHTML = dateTimeString;
}

      let emailEdited = false;
      let firstNameEdited = false;
      let lastNameEdited = false;
      let phoneEdited = false;
      let typeOfUser = false;
      let photoEdited = false;
      let editField = false;

   
async function saveChanges(token, username) {
   const updatedUserData = {};
  
    //Objeto para armazenar os dados atualizados do user

   if (photoEdited && document.getElementById("edit_URL").value != "") {
      const newImage = document.getElementById("edit_URL").value;
      if(isValidURL(newImage)){
         updatedUserData.imgURL = newImage;
         editField = true;
      }else{alert("Invalid URL");editField = false;
       document.getElementById("edit_URL").value = "";
       document.getElementById("edit_URL").placeholder = user.imgURL;
      }}
   

   if (emailEdited && document.getElementById("edit_email").value != "") {
      const email = document.getElementById("edit_email").value;
      if(isValidEmail(email) == true){
      updatedUserData.email = email;
      editField = true;
      }else{alert("Invalid email");editField = false; 
      document.getElementById("edit_email").value = "";
      document.getElementById("edit_email").placeholder = user.email;
   }}
   
   if (firstNameEdited && document.getElementById("edit_firstName").value != "") {
      if (document.getElementById("edit_firstName").value.length < 13) {
         updatedUserData.firstName = document.getElementById("edit_firstName").value;
         editField = true;
         
      }
   }
   if (lastNameEdited && document.getElementById("edit_lastName").value != "") {
      updatedUserData.lastName = document.getElementById("edit_lastName").value;
      editField = true;

   }
   if (phoneEdited && document.getElementById("edit_phone").value != "") {
      const newPhone = document.getElementById("edit_phone").value;
      if (isValidPhoneNumber(newPhone)) {
        updatedUserData.phoneNumber = newPhone;
        editField = true;
      } else{
         alert("Invalid phone number");
         editField = false;
         document.getElementById("edit_phone").value = "";
         document.getElementById("edit_phone").placeholder = user.phoneNumber;
      }
   }
   
   if (typeOfUser && document.getElementById("edit_element").value != "") {
      updatedUserData.typeOfUser = document.getElementById("edit_element").value;
      editField = true;
   }
console.log(updatedUserData);

   try {
      const responseStatus = await updateProfile(token, username, updatedUserData);
      console.log(responseStatus);
      return responseStatus; 
   } catch (error) {
      
   }
}

//action listenner para o botao save da pagina

const bntSave = document.getElementById("btn-save");
bntSave.addEventListener("click", async function () {
    

   if(await saveChanges(token, username)){
      alert("Your valid changes have been saved");
      sessionStorage.removeItem('username');
      window.location.href = "productOwner.html";
   }
   else{
      alert("Failed to update user");
  
   }

});

async function updateProfile(token,username, updatedUserData) {

   try {
       const response = await fetch("http://localhost:8080/project_backend/rest/users/updateProfilePO", {
           method: 'PUT',
           headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            token:token,
            username:username
           },
           body: JSON.stringify(updatedUserData)
       });

       if (response.ok) {
           const data = await response.json();
           console.log(data);
           return data;
       }else{
         const errorMessage = await response.text();
         console.log(errorMessage);
         return errorMessage;
      }
    
   }catch(error){
      alert("Something went wrong");
   }
}

function isValidPhoneNumber(phoneNumber) {
   valideNumber = true;

   if (phoneNumber.length != 9 && phoneNumber.length != 10) valideNumber = false;
   // Check if the phone number has the expected format
   if (!phoneNumber.match(/^\d+$/)) {
      valideNumber = false;
   }
   return valideNumber;
}

function isValidEmail(email) {
   return email.includes("@") && email.includes(".");
}
