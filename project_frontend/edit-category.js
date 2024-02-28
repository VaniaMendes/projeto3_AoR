
const url = new URL(window.location.href);
const categoryId = url.searchParams.get("categoryId");
const token = sessionStorage.getItem("token");

window.onload = function() {


    
    const firstName_txt = document.querySelector("#user");
    const user_img = document.querySelector("#user_img");

    document.querySelector("#title").value = "";
    document.querySelector("#description").value = "";

    
    const url = new URL(window.location.href);
    const categoryId = url.searchParams.get("categoryId");

    getCategoryById(categoryId, token);


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
       addButtonsForUserType(role);
          
       }
    });
    
 }

    async function getCategoryById(categoryId, token) {

        let getCategoryRequest = `http://localhost:8080/project_backend/rest/categories/getCategoryById/${categoryId}`

        try {
            const response = await fetch(getCategoryRequest, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    token: token
                }
            });

            if (response.ok) {
                const category = await response.json();
                
                document.querySelector("#title").placeholder = category.title;
                document.querySelector("#description").placeholder = category.description;

            } else {
                console.error("Failed to fetch category data");
                return null;
            }
        } catch (error) {
            console.error("Error fetching category data:", error);
            return null;
        }

    }

    async function editCategory(categoryId, token) {
        let title = document.querySelector("#title").value;

        if (title == "") {
            title = document.querySelector("#title").placeholder;
        }
        let description = document.querySelector("#description").value;

        let editCategoryRequest = `http://localhost:8080/project_backend/rest/categories/update/${categoryId}`

        try {
            const response = await fetch(editCategoryRequest, {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    token: token
                },
                body: JSON.stringify({
                    title: title,
                    description: description, 
                    idCategory: categoryId
                })
            });

            if (response.ok) {
                window.location.href = "createCategory.html";
            } else {
                const errorMessage = await response.text(); 
                document.getElementById('error_editing_category').textContent = errorMessage;
                console.error("Failed to create category:", errorMessage);
                
            }
        } catch (error) {
            console.error("Error editing category data:", error);
            
        }
    }

document.querySelector("#category_edit_save").addEventListener("click", function () {
    editCategory(categoryId, token);
    document.querySelector("#title").value = "";
    document.querySelector("#description").value = "";
    
});

document.querySelector("#category_edit_delete").addEventListener("click", function () {
    document.querySelector("#title").value = "";
    document.querySelector("#description").value = "";
    window.location.href = "createCategory.html";
});


 document.querySelector("#logout").addEventListener("click", function () {
    if (confirm("Are you sure you want to logout?")) {
       sessionStorage.clear();
       window.location.href = "login.html";
    }
 });


 document.querySelector("#btn_scrumBoard").addEventListener("click", function () {
    
    window.location.href = "scrum.html";
    
 });

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

 function addButtonsForUserType(userType) {
    const menu = document.getElementById('menu'); //  elemento com o ID 'menu' onde os botões serão adicionados
 
    if (userType === 'product_owner') {
        
        // Adicionar botão para consultar lista de todos os usuários
        const listButton = document.createElement('button'); listButton.id = "listButton";
        listButton.classList.add("menu_item"); listButton.innerHTML = ".";
        listButton.textContent = 'All Users';
        listButton.addEventListener('click', function() {
          window.location.href = "productOwner.html";
            
        });
 
        

          //botão que chama criar categoria, só aparece nesta página

          const createCategoryButton = document.createElement('button'); createCategoryButton.id = "listButton";
          createCategoryButton.classList.add("menu_item"); createCategoryButton.innerHTML = ".";
          createCategoryButton.textContent = 'Categories';
            createCategoryButton.addEventListener('click', function() {
               window.location.href = "createCategory.html";
               
            });

          
       menu.appendChild(listButton);
       menu.appendChild(createCategoryButton);
        
       
    } else if (userType === 'ScrumMaster') {
     
 
    } else if (userType === 'Developer') {
        
    }
 }