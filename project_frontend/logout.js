

async function logoutUser(token){
    try{
       const response = await fetch("http://localhost:8080/project_backend/rest/users/logout",{
 
          method: "POST",
          headers: {
           Accept: "*/*",
           "Content-Type": "application/json",
           'token': token
          }
          });
 
          if(response.ok){
             const response = await response.json();
             return response;
          }else{
             const error = await response.json();
             return error;
          }
    }catch (error) {
        console.error('Fetch Error:', error);
    }
 }

 document.querySelector("#logout").addEventListener("click", function () {
    if (confirm("Are you sure you want to logout?")) {
       sessionStorage.clear();
       logoutUser(token);
       window.location.href = "login.html";
    }
 });

 
function writeDate() {
    const d = new Date();
 
    // Define o formato a mostrar
    let dateTimeString = d.toLocaleString("en-GB");
    dateTimeString = dateTimeString.replace(",", "&nbsp; &nbsp; &nbsp;");
 
    // Insere no HTML
    document.getElementById("date").innerHTML = dateTimeString;
 }
  
 writeDate();
