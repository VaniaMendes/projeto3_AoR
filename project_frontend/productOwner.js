const token = sessionStorage.getItem("token");
const img_user = document.getElementById("user_img");
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
    user = result;
    if (user == null) {
       window.location.href = "login.html";
    } else {
        document.getElementById("user_name").textContent = user.firstName;
       if(user.imgURL){
        img_user.src = user.imgURL;
       }else{
        img_user.src = 'user.png';
       }
       
    }
 });