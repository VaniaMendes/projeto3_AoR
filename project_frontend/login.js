sessionStorage.clear();

document.querySelector("#login_form").addEventListener("submit", function (e) {
   e.preventDefault();

   let username_txt = document.querySelector("#username").value;
   let pass_txt = document.querySelector("#password").value;
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
         const token = await response.json();
         sessionStorage.setItem("token", token);
         window.location.href = "scrum.html";
         console.log(token);
      } else if (response.status == 404) {
         alert("Wrong username or password");
      } else {
         alert("something went wrong :(");
      }
   } catch (error) {
      console.log(error);
   }
}
