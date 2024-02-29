sessionStorage.clear();

document.querySelector("#login_form").addEventListener("submit", function (e) {
   e.preventDefault();
   validateUser(username_txt, pass_txt);
});
async function validateUser(username, password) {
   const user = {username: username, password: password};
   try{
      const response = await fetch(
      "http://localhost:8080/project_backend/rest/users/login",

      {
         method: "POST",
         headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
         },
         body: JSON.stringify(user),
      }
   )
      if (response.ok) {
         try{
         const data = await response.json();
         const token = data.token;
         sessionStorage.setItem("token", token);
         sessionStorage.setItem("username", username);
         sessionStorage.setItem("pass", password);
         window.location.href = "scrum.html";
         
        
         } catch (error) {
            console.error("Erro ao analisar a resposta JSON");
         }
      } else if (response.status == 404) {
         alert("Wrong username or password");
      } else {
         alert("something went wrong:(");
      }
   } catch (error) {
      console.log(error);
   }
}
