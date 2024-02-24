

//Executa a função em intervalos de 1 segundo para atualizar a data
writeDate();
setInterval(writeDate, 1000);

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
      document.getElementById("username_edit").textContent = user.username;
      document.getElementById("edit_firstName").placeholder = user.firstName;
      document.getElementById("edit_lastName").placeholder = user.lastName;
      document.getElementById("edit_email").placeholder = user.email;
      document.getElementById("edit_password").placeholder = user.password;
      document.getElementById("edit_phone").placeholder = user.phoneNumber;
      document.getElementById("user_photo").placeholder = user.imgURL
      document.getElementById("user").textContent = user.firstName;    
      document.getElementById("user_img").src = user.imgURL;
   }

});

async function updateProfile(token, updatedUserData) {

   try {
       const response = await fetch("http://localhost:8080/project_backend/rest/users/updateProfile", {
           method: 'PUT',
           headers: {
               'Content-Type': 'application/json',
               'Accept': '/',
               token: token
           },
           body: JSON.stringify(updatedUserData)
       });

       if (response.ok) {
           const data = await response.json();
           document.getElementById("edit_firstName").placeholder = data.firstName || '';
           document.getElementById("edit_lastName").placeholder = data.lastName || '';
           document.getElementById("edit_phone").placeholder = data.phone || '';
           document.getElementById("edit_URL").placeholder = data.photoURL || '';
           document.getElementById("edit_email").placeholder = data.email || '';
           document.getElementById("edit_password").placeholder = data.password || '';

       } else {

       }
   } catch (error) {
       console.error('Error:', error);
       alert("Something went wrong");
   }
}







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



document.querySelector("header h1").addEventListener("click", function () {
   window.location.href = "scrum.html";
});


// Adiciona um evento de alteração para cada campo de entrada
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

      emailEdited = false;
      firstNameEdited = false;
      lastNameEdited = false;
      phoneEdited = false;
      passwordEdited = false;
      photoEdited = false;


async function saveChanges() {
   let editField = false;
   let wrongField = false;
   const updatedUserData = {}; //Objeto para armazenar os dados atualizados do user

   if (photoEdited && document.getElementById("edit_photoLabel").value != "") {
      updatedUserData.imgURL = document.getElementById("edit_URL").value;
      editField = true;
   }

   if (emailEdited && document.getElementById("edit_email").value != "") {
      updatedUserData.email = document.getElementById("edit_email").value;
      editField = true;
   }
   if (firstNameEdited && document.getElementById("edit_firstName").value != "") {
      if (viewFirstName.value.length < 13) {
         updatedUserData.firstName = document.getElementById("edit_firstName").value;
         editField = true;
         alert(updatedUserData.firstName);
      }
   }
   if (lastNameEdited && document.getElementById("edit_lastName").value != "") {
      updatedUserData.lastName = document.getElementById("edit_lastName").value;
      editField = true;

   }
   if (phoneEdited && document.getElementById("edit_phone").value != "") {
      if (isValidPhoneNumber(newPhone)) {
        updatedUserData.phoneNumber =document.getElementById("edit_phone").value;
        editField = true;
      } 
   }
   
   if (passwordEdited && document.getElementById("edit_password").value != "") {
      updatedUserData.password = document.getElementById("edit_password").value;
      editField = true;
   }
   if(photoEdited && document.getElementById("edit_URL").value!= "") {
      updatedUserData.imgURL = document.getElementById("edit_URL").value;
   }

   const result = await updateProfile(token, updatedUserData);
   return result;
   
}



//action listenner para o botao save da pagina

const bntSave = document.getElementById("btn-save");
bntSave.addEventListener("click", async function () {
   const result = await saveChanges();

   if(result == true){
      alert("Your changes have been saved!");
      window.location.href = "scrum.html";
   }else{
      alert("Some of the changes you made are not valid.");
   }

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
