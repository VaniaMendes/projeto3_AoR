
const firstName_txt = document.querySelector("#user");
//const retros = JSON.parse(localStorage.getItem("retros")) || [];
const user_img = document.querySelector("#user_img");
let user = null;

const token = sessionStorage.getItem("token");
const userType = sessionStorage.getItem('role');

writeDate();

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
   user = result;
   if (user == null) {
      window.location.href = "login.html";
   } else {
      firstName_txt.textContent = user.firstName;
      const role = user.typeOfUser;
      sessionStorage.setItem('userType', role);

      if(user.imgURL){
         user_img.src = user.imgURL;
      }else{user_img.src = 'user.png';
   }
   
      
   }
});



//Carregar no logo para voltar à página inicial 
document.querySelector("header h1").addEventListener("click", function () {
    window.location.href = "login.html";
 });

console.log("chegou aqui");

 document.getElementById("registerPO_submit").addEventListener('click', async function (event) {
    event.preventDefault();
    let newUser = createUserData();
    console.log(newUser)

    try {
        const response = await fetch("http://localhost:8080/project_backend/rest/users/addUserByPO", {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                'token':token
            },
            body: JSON.stringify(newUser)
        });
 
        if (response.ok) {
        
            console.log(newUser)
            alert("Account registered successfully!")
            window.location.href = 'productOwner.html';
             
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
    
        let username = document.getElementById('register_usernamePO').value.trim();
        let password = document.getElementById('register_passwordPO').value.trim();
        let email = document.getElementById('register_emailPO').value.trim();
        let firstName = document.getElementById('register_firstNamePO').value.trim();
        let lastName = document.getElementById('register_lastNamePO').value.trim();
        let phone = document.getElementById('register_phonePO').value.trim();
        let photoURL = document.getElementById('register_photo_mainPO').value.trim();
        let typeOfUser = document.getElementById('register_typeOfUser').value.trim();
        console.log(typeOfUser);
 
        return {
            username: username,
            password: password,
            email: email,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phone,
            imgURL: photoURL,
            typeOfUser: typeOfUser
        };
    
 }
 

 document.querySelector("#btn_scrumBoard").addEventListener("click", function () {
    window.location.href = "scrum.html";
 });

 function writeDate() {
    const d = new Date();
 
    // Define o formato a mostrar
    let dateTimeString = d.toLocaleString("en-GB");
    dateTimeString = dateTimeString.replace(",", "&nbsp; &nbsp; &nbsp;");
 
    // Insere no HTML
    document.getElementById("date").innerHTML = dateTimeString;
 }