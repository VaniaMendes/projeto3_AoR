
//Carregar no logo para voltar à página inicial 
document.querySelector("header h1").addEventListener("click", function () {
   window.location.href = "login.html";
});


//Request para criar nova conta 
document.getElementById("register_submit").addEventListener('click', async function (event) {
   event.preventDefault();

   let newUser = createUserData();

   let registerRequest = "http://localhost:8080/project_backend/rest/users/addUserDB";
   const inputFieldIds = [
       'register_username', 
       'register_password', 
       'register_email', 
       'register_firstName',
       'register_lastName',
       'register_phone',
       'register_photo_main'
   ];

   try {
       const response = await fetch(registerRequest, {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
               'Accept': '*/*'
           },
           body: JSON.stringify(newUser)
       });

       if (response.ok) {
           alert("Account registered successfully!")

           //depois da conta criada com sucesso, apaga os campos escritos pelo user
   
           inputFieldIds.forEach(fieldId => {
               document.getElementById(fieldId).value = '';
           });
         window.location.href = 'login.html';
            
       } else {
           switch (response.status) {
               case 422:
                   const errorData = await response.text();
                   switch (errorData) {
                       case "There's an empty field, fill all values":
                           alert("Please fill all fields");
                           break;
                       case "Invalid email":
                           alert("The email you used is not valid");
                           break;
                       case "Image URL invalid":
                           alert("Image url provided not valid");
                           break;
                       case "Invalid phone number":
                           alert("The phone number is not valid");
                           break;
                       default:
                           console.error('Unknown error message:', errorData);
                           alert("Something went wrong");
                   }
                   break;
               case 409: 
                   alert("Username already in use");
                   break;
               default:
                   alert("Something went wrong");
           }
       }
   } catch (error) {
       console.error('Error:', error);
       alert("Something went wrong");
   }
});


function createUserData() {
   
       let username = document.getElementById('register_username').value.trim();
       let password = document.getElementById('register_password').value.trim();
       let email = document.getElementById('register_email').value.trim();
       let firstName = document.getElementById('register_firstName').value.trim();
       let lastName = document.getElementById('register_lastName').value.trim();
       let phone = document.getElementById('register_phone').value.trim();
       let photoURL = document.getElementById('register_photo_main').value.trim();

       return {
           username: username,
           password: password,
           email: email,
           firstName: firstName,
           lastName: lastName,
           phoneNumber: phone,
           imgURL: photoURL, 
           typeOfUser: "developer"
       };
   
}
