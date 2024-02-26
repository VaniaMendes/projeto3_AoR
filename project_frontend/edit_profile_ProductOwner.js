

//Executa a função em intervalos de 1 segundo para atualizar a data
writeDate();
setInterval(writeDate, 1000);

const token = sessionStorage.getItem("token");
const username = sessionStorage.getItem("username");
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
      document.getElementById("username_edit").textContent = user.username; 
   }

});

async function getUserByUsername(token, username) {
    const data = {username: username};
    try {
        const response = await fetch("http://localhost:8080/project_backend/rest/users", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                token:token
            },
             body: JSON.stringify(data)
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
       window.location.href = "login.html";
    
    } else {
       user=result;
       user_photo.src = user.imgURL;
       document.getElementById("edit_firstName").placeholder = user.firstName;
       document.getElementById("edit_URL").placeholder = user.imgURL;
       document.getElementById("edit_lastName").placeholder = user.lastName;
       document.getElementById("edit_email").placeholder = user.email;
       document.getElementById("edit_password").placeholder = user.password;
       document.getElementById("edit_phone").placeholder = user.phoneNumber;
       document.getElementById("user_photo").placeholder = user.imgURL;
    }
    
 });



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
document.getElementById("btn_cancel").addEventListener("click", function () {
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

      let emailEdited = false;
      let firstNameEdited = false;
      let lastNameEdited = false;
      let phoneEdited = false;
      let passwordEdited = false;
      let photoEdited = false;
      let editField = false;

   const updatedUserData = {};
async function saveChanges() {
  
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
   
   if (passwordEdited && document.getElementById("edit_password").value != "") {
      updatedUserData.password = document.getElementById("edit_password").value;
      editField = true;
   }


   try {
      const responseStatus = await updateProfile(token, updatedUserData);
      return responseStatus; 
   } catch (error) {
      
   }
   
}



//action listenner para o botao save da pagina

const bntSave = document.getElementById("btn-save");
bntSave.addEventListener("click", async function () {
   const result = await saveChanges();
   console.log(result);

   if(result == 200 && Object.keys(updatedUserData).length !== 0){
      alert("Your valid changes have been saved");
      window.location.href = "scrum.html";
   }
   else if(result == 422){
      alert("Invalid data");
  
      
   }else{}

});


async function updateProfile(token,updatedUserData) {

   try {
       const response = await fetch("http://localhost:8080/project_backend/rest/users/updateProfile", {
           method: 'PUT',
           headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            token:token
           },
           body: JSON.stringify(updatedUserData)
       });

       if (response.ok) {
           const data = await response.json();
       }else{
         const errorMessage = await response.text();
           if (response.status === 401) {
               window.location.href = "login.html";
           } else if (response.status === 422) {
         
           } else {   
       }
      }
      return response.status;
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
