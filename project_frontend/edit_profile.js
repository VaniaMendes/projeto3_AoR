
const token = sessionStorage.getItem("token");


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
      user_img.src = user.imgURL;
      user_photo.src = user.imgURL;
      if(user.username){
         document.getElementById("username_edit").textContent = user.username;
      }
      if (user.firstName) {
         document.querySelector("#viewFirstName").placeholder = user.firstName;
      }
      if (user.lastName) {
         document.querySelector("#viewLastName").placeholder = user.lastName;
      }
      if (user.email) {
         document.querySelector("#viewEmail").placeholder = user.email;
      }
      if (user.phoneNumber) {
         document.querySelector("#viewPhone").placeholder = user.phoneNumber;
      }
      if (user.password) {
         document.querySelector("#viewpassword").placeholder = user.password;
      }
      document.querySelector("#user").textContent = user.firstName; 
   }

});

writeDate();

//Executa a função em intervalos de 1 segundo para atualizar a data
setInterval(writeDate, 1000);


document.querySelector("#btn_scrumBoard").addEventListener("click", function () {
   window.location.href = "scrum.html";
});

document.querySelector("#logout").addEventListener("click", function () {
   if (confirm("Are you sure you want to logout?")) {
      sessionStorage.clear();
      window.location.href = "login.html";
   }
});


//action Listenner para o botao Cancel
document.querySelector("#btn_cancel").addEventListener("click", function () {
   window.location.href = "scrum.html";
});


edit_photoLabel = document.querySelector("#edit_photoLabel");

edit_photoLabel.addEventListener("change", function () {
   if (isValidURL(edit_photoLabel.value)) {
      imageModal.src = edit_photoLabel.value;
   } else {
      imageModal.src = user_img.src;
   }
});

document.querySelector("header h1").addEventListener("click", function () {
   window.location.href = "scrum.html";
});



// Adiciona um evento de alteração para cada campo de entrada
document.getElementById("edit_photoLabel").addEventListener("change", function () {
   photoEdited = true;
});
document.getElementById("edit_password").addEventListener("change", function () {
   passwordEdited = true;
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
// Variáveis de controle para cada campo editável
var passwordEdited = false;
var emailEdited = false;
var firstNameEdited = false;
var lastNameEdited = false;
var phoneEdited = false;
var photoEdited = false;

// Funçãoconst editField = false; para salvar as alterações
async function saveChanges() {
   let editField = false;
   let wrongField = false;

   if (photoEdited && document.getElementById("edit_photoLabel").value != "") {
      newPhoto = document.querySelector("#edit_photoLabel").value;
      updatePhoto(username, password, user_photo.src).then((response) => {
         if (response.status === 200) {
            user_img.src = user_photo.src;
         } else if (response.status === 404) {
            alert("User not found");
            window.location.href = "login.html";
         }
      });
      editField = true;
   }

   if (emailEdited && document.getElementById("edit_email").value != "") {
      const newEmail = document.getElementById("edit_email").value;
      if (isValidEmail(newEmail)) {
         updateEmail(username, password, newEmail).then((response) => {
            if (response.status === 200) {
               viewEmail.value = newEmail;
            }
         });
         editField = true;
      } else wrongField = true;
   }
   if (firstNameEdited && document.getElementById("edit_firstName").value != "") {
      if (viewFirstName.value.length < 13) {
         const newFirstName = document.getElementById("edit_firstName").value;
         updateFirstName(username, password, newFirstName).then((response) => {
            if (response.status === 200) {
               viewFirstName.value = newFirstName;
            } else if (response.status == 404) window.location.href = "login.html";
         });
         editField = true;
      } else wrongField = true;
   }
   if (lastNameEdited && document.getElementById("edit_lastName").value != "") {
      const newLastName = document.getElementById("edit_lastName").value;
      updateLastName(username, password, newLastName).then((response) => {
         if (response.status === 200) {
            viewLastName.value = newLastName;
         } else if (response.status === 404) {
            alert("user not found");
            window.location.href = "login.html";
         }
      });
      editField = true;
   }
   if (phoneEdited && document.getElementById("edit_phone").value != "") {
      const newPhone = document.getElementById("edit_phone").value;
      if (isValidPhoneNumber(newPhone)) {
         updatePhoneNumber(username, password, newPhone).then((response) => {
            if (response.status === 200) {
               viewPhone.value = newPhone;
            } else if (response.status === 404) {
               alert("user not found");
               window.location.href = "login.html";
            }
         });
         editField = true;
      } else wrongField = true;
   }
   if (passwordEdited && document.getElementById("edit_password").value != "") {
      // Salvar a nova senha
      const newPassword = document.getElementById("edit_password").value;
      // Chame a função para atualizar a senha no backend
      updatePassword(username, password, newPassword).then((response) => {
         if (response.status == 200) {
            viewpassword.value = newPassword;
            sessionStorage.setItem("pass", newPassword);
         } else if (response.status == 404) {
            alert("user not found");
            window.location.href = "login.html";
         }
      });
      editField = true;
   }

   // Reinicie as variáveis de controle passwordEdited = false;
   emailEdited = false;
   firstNameEdited = false;
   lastNameEdited = false;
   phoneEdited = false;
   passwordEdited = false;

   if (editField == true && wrongField == false) {
      return true;
   } else return false;
}

//action listenner para o botao save da pagina

const bntSave = document.getElementById("btn-save");
bntSave.addEventListener("click", function () {
   saveChanges().then((result) => {
      console.log(result);
      if (result == true) {
         alert("Your changes have been saved");
         window.location.href = "scrum.html";
      } else if (
         document.getElementById("edit_password").value != "" ||
         document.getElementById("edit_phone").value != "" ||
         document.getElementById("edit_lastName").value != "" ||
         document.getElementById("edit_firstName").value != "" ||
         document.getElementById("edit_email").value != ""
      ) {
         document.getElementById("edit_password").value = "";
         document.getElementById("edit_phone").value = "";
         document.getElementById("edit_lastName").value = "";
         document.getElementById("edit_firstName").value = "";
         document.getElementById("edit_email").value = "";
         alert("Some of the changes you made are not valid.");
      } else {
         alert("You didn't change any field.");
      }
   });
});




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
