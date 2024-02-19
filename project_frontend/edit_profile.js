const username = sessionStorage.getItem("username");
const password = sessionStorage.getItem("pass");
const background = document.querySelector("#background");
const modalPhoto = document.querySelector("#edit_modal");
const user_img = document.querySelector("#user_img");
const body_color = document.querySelector("#body_color");

const imageModal = document.getElementById("edit_photo");
const user_photo = document.getElementById("user_photo");

let user = null;

writeDate();

//Executa a função em intervalos de 1 segundo para atualizar a data
setInterval(writeDate, 1000);

getUser(username, password).then((result) => {
   if (result == null) {
      window.location.href = "login.html";
   } else {
      user = result;
      user_img.src = user.imgURL;
      imageModal.src = user.imgURL;
      user_photo.src = user.imgURL;
      viewpassword.placeholder = user.password;
      viewEmail.placeholder = user.email;
      viewFirstName.placeholder = user.firstName;
      viewLastName.placeholder = user.lastName;
      viewPhone.placeholder = user.phoneNumber;
      body_color.style.backgroundColor = user.background_color;
      document.querySelector("#user").textContent = result.firstName;
      document.querySelector("#user_img").src = result.imgURL;
   }
});

const viewpassword = document.getElementById("edit_password");
const viewEmail = document.getElementById("edit_email");
const viewFirstName = document.getElementById("edit_firstName");
const viewLastName = document.getElementById("edit_lastName");
const viewPhone = document.getElementById("edit_phone");

document.querySelector("#btn_scrumBoard").addEventListener("click", function () {
   window.location.href = "scrum.html";
});

document.querySelector("#logout").addEventListener("click", function () {
   if (confirm("Are you sure you want to logout?")) {
      sessionStorage.clear();
      window.location.href = "login.html";
   }
});

// Verifica se o nome de usuário está armazenado no localStorage
if (username !== null) {
   // Exibe o nome de usuário no elemento HTML com id "username"
   document.getElementById("username_edit").textContent = username;
} else {
   // Caso o nome de usuário não esteja armazenado, exibe uma mensagem padrão
   document.getElementById("username_edit").textContent = "Username not found";
}

//action Listenner para o botao Cancel
document.querySelector("#btn_cancel").addEventListener("click", function () {
   window.location.href = "scrum.html";
});

//action listenner para o botao Change Photo
document.querySelector("#change_photo").addEventListener("click", function () {
   background.style.visibility = "visible";
   modalPhoto.style.visibility = "visible";
});

background.addEventListener("click", function () {
   background.style.visibility = "hidden";
   modalPhoto.style.visibility = "hidden";
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

//action listenner para o botao save da foto
document.querySelector("#edit_confirmPhoto").addEventListener("click", function () {
   newPhoto = document.querySelector("#edit_photoLabel").value;
   const validURL = isValidURL(newPhoto);

   if (validURL == true) {
      user_photo.src = newPhoto;
   }
   background.style.visibility = "hidden";
   modalPhoto.style.visibility = "hidden";
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

async function updatePhoto(username, pass, newPhoto) {
   let response = await fetch("http://localhost:8080/project_backend/rest/users/updatePhoto", {
      method: "PUT",
      headers: {
         Accept: "*/*",
         "Content-Type": "application/json",
         username: username,
         password: pass,
         newPhoto: newPhoto,
      },
   });
   return response;
}

async function updatePassword(username, password, newPassword) {
   let response = await fetch("http://localhost:8080/project_backend/rest/users/updatePassword", {
      method: "PUT",
      headers: {
         Accept: "*/*",
         "Content-Type": "application/json",
         username: username,
         password: password,
         newPassword: newPassword,
      },
   });
   return response;
}

async function updateEmail(username, pass, newEmail) {
   let response = await fetch("http://localhost:8080/project_backend/rest/users/updateEmail", {
      method: "PUT",
      headers: {
         Accept: "*/*",
         "Content-Type": "application/json",
         username: username,
         password: pass,
         email: newEmail,
      },
   });
   return response;
}
async function updateFirstName(username, password, newFirstName) {
   let response = await fetch("http://localhost:8080/project_backend/rest/users/updateFirstName", {
      method: "PUT",
      headers: {
         Accept: "*/*",
         "Content-Type": "application/json",
         username: username,
         password: password,
         firstName: newFirstName,
      },
   });
   return response;
}
async function updateLastName(username, password, newLastName) {
   let response = await fetch("http://localhost:8080/project_backend/rest/users/updateLastName", {
      method: "PUT",
      headers: {
         Accept: "*/*",
         "Content-Type": "application/json",
         username: username,
         password: password,
         lastName: newLastName,
      },
   });
   return response;
}
async function updatePhoneNumber(username, password, newPhoneNumber) {
   let response = await fetch("http://localhost:8080/project_backend/rest/users/updatePhoneNumber", {
      method: "PUT",
      headers: {
         Accept: "*/*",
         "Content-Type": "application/json",
         username: username,
         password: password,
         phonenumber: newPhoneNumber,
      },
   });

   return response;
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
