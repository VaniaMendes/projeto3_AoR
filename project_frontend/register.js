const modal = document.querySelector("#register_modal");
const background = document.querySelector("#background");
const photo_label = document.querySelector("#register_photoLabel");
const photo = document.querySelector("#register_photo");
const username_txt = document.querySelector("#register_username");
const password = document.querySelector("#register_password");
const email = document.querySelector("#register_email");
const firstName = document.querySelector("#register_firstName");
const lastName = document.querySelector("#register_lastName");
const phone = document.querySelector("#register_phone");
const form1 = document.querySelector("#form_register");

form1.addEventListener("submit", function (e) {
   e.preventDefault();
   if (
      username_txt.value != "" &&
      password.value != "" &&
      email.value != "" &&
      firstName.value != "" &&
      lastName.value != "" &&
      phone.value != ""
   ) {
      if (firstName.value.length < 13) {
         if (isValidPhoneNumber(phone.value)) {
            if (isValidEmail(email.value)) {
               validateUser(
                  username_txt.value,
                  password.value,
                  email.value,
                  firstName.value,
                  lastName.value,
                  phone.value
               );
            } else alert("Invalid email");
         } else alert("Invalid phone number");
      } else alert("First Name is too long");
   } else alert("All fields are required");
});

document.querySelector("#register_confirmPhoto").addEventListener("click", function () {
   addUser(username_txt.value, password.value, email.value, firstName.value, lastName.value, phone.value, photo.src);
   alert("Welcome to AgileUp! :)");
   window.location.href = "login.html";
});

background.addEventListener("click", function () {
   modal.style.visibility = "hidden";
   background.style.visibility = "hidden";
});

photo_label.addEventListener("change", function () {
   if (isValidURL(photo_label.value)) {
      photo.src = photo_label.value;
   } else photo.src = "user.png";
});

document.querySelector("header h1").addEventListener("click", function () {
   window.location.href = "login.html";
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

async function validateUser(username_txt, password_txt, email_txt, firstName_txt, lastName_txt, phoneNumber_txt) {
   const userData = {
      username: username_txt,
      password: password_txt,
      email: email_txt,
      firstName: firstName_txt,
      lastName: lastName_txt,
      phoneNumber: phoneNumber_txt,

   };
   try{
   
   const response = await fetch(
      "http://localhost:8080/project_backend/rest/users/register",

      {
         method: "POST",
         headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            
         },
         body: JSON.stringify(userData),
      }
   );
   
      if (response.ok) {
         modal.style.visibility = "visible";
         background.style.visibility = "visible";
      } else if (response.status == 409){
         const data = await response.json();
         alert(data.message);
      } 
      else {alert("Something went wrong");
      alert("Something went wrong");
      }
   } catch (error) {
   alert("Something went wrong");
}
}

async function addUser(username, password, email, firstName, lastName, phoneNumber, imgURL) {
   let user = {
      username: username,
      password: password,
      email: email,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      imgURL: imgURL,
   };
   await fetch("http://localhost:8080/project_backend/rest/users/add", {
      method: "POST",
      headers: {
         Accept: "*/*",
         "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
   });

   if(response.status == 200) {
      alert("User added successfully");

   }
}
