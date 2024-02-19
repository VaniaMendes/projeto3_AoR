sessionStorage.clear();

document.querySelector("#login_form").addEventListener("submit", function (e) {
   e.preventDefault();

   let username_txt = document.querySelector("#username").value;
   let pass_txt = document.querySelector("#password").value;
   validateUser(username_txt, pass_txt);
});
async function validateUser(username, password) {
   await fetch(
      "http://localhost:8080/project_backend/rest/users/login",

      {
         method: "POST",
         headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            username: username,
            password: password,
         },
      }
   ).then(function (response) {
      if (response.status == 200) {
         sessionStorage.setItem("username", username);
         sessionStorage.setItem("pass", password);
         window.location.href = "scrum.html";
      } else if (response.status == 404) {
         alert("Wrong data");
      } else {
         alert("something went wrong :(");
      }
   });
}
