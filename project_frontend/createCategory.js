
window.onload = function() {

    const token = sessionStorage.getItem("token");
    const firstName_txt = document.querySelector("#user");
    const user_img = document.querySelector("#user_img");

    getAllCategories(token);

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

          const createCategory = document.createElement('button'); createCategory.id = "listButton";
          createCategory.classList.add("menu_item"); createCategory.innerHTML = ".";
          createCategory.textContent = 'Create Category';
          createCategory.addEventListener('click', function() {
            document.getElementById('categoryModal').style.display = 'block';
            document.getElementById('error_creating_category').textContent = '';
            document.getElementById('overlay-modal-category').style.display = 'block';
             
          });

          document.getElementById('cancel').addEventListener('click', function() {
            document.getElementById('categoryModal').style.display = 'none';
            document.getElementById('overlay-modal-category').style.display = 'none';
            document.getElementById('title').value = '';
            document.getElementById('description').value = '';
        });

         document.getElementById('category_delete').addEventListener('click', function() {
         document.getElementById('categoryModal').style.display = 'none';
         document.getElementById('overlay-modal-category').style.display = 'none';
         document.getElementById('title').value = '';
         document.getElementById('description').value = '';
      });

    
 
       menu.appendChild(listButton);
       menu.appendChild(createCategoryButton);
       menu.appendChild(createCategory);
        
       
    } else if (userType === 'ScrumMaster') {
     
 
    } else if (userType === 'Developer') {
        
    }
 }

   document.getElementById('category_save').addEventListener('click', function() {
      const title = document.getElementById('title').value.trim();
      const description = document.getElementById('description').value.trim();
      const token = sessionStorage.getItem("token");
      
      createCategory(title, description, token);
   });

   async function createCategory(title, description, token) {

      let createCategoryRequest = "http://localhost:8080/project_backend/rest/categories/createCategory";

      try {
          const response = await fetch(createCategoryRequest, {
              method: "POST",
              headers: {
                  'Accept': '*/*',
                  "Content-Type": "application/json",
                  token: token
              },
              body: JSON.stringify({
                  title: title,
                  description: description
              })
          });
  
          if (response.ok) {
               console.log("Category created successfully");
              
              
              document.getElementById('categoryModal').style.display = 'none';
              document.getElementById('overlay-modal-category').style.display = 'none';
              document.getElementById('title').value = '';
              document.getElementById('description').value = '';

               removeAllRows();
               getAllCategories(token);
              
          } else {
            const errorMessage = await response.text(); 
            document.getElementById('error_creating_category').textContent = errorMessage;
            console.error("Failed to create category:", errorMessage);

            }
      } catch (error) {
          console.error("Error creating category:", error);
          return null;
      }
   }

   //função para listar todas as categorias
   async function getAllCategories(token) {
      
      const categoriesRequest = "http://localhost:8080/project_backend/rest/categories/getAllCategories";
      try {
          const response = await fetch(categoriesRequest, {
              method: "GET",
              headers: {
                  Accept: "*/*",
                  "Content-Type": "application/json",
                  token: token
              }
          });
  
          if (response.ok) {
               const categories = await response.json();
              
              listCategories(categories);
          } else {

            const errorMessage = await response.text(); 
            console.error("Failed to fetch categories: " + errorMessage);
          }
      } catch (error) {
          console.error("Error fetching categories:", error);
      }
   }

   async function deleteCategory(categoryId, token) {


      let deleteCategoryRequest = `http://localhost:8080/project_backend/rest/categories/delete/${categoryId}`;
      try {
          const response = await fetch(deleteCategoryRequest, {
              method: "DELETE",
              headers: {
                  'Accept': '*/*',
                  "Content-Type": "application/json",
                  token: token
              }
            });

            if (response.ok) {
               console.log("Category deleted successfully");
               removeAllRows();
               getAllCategories(token);
            } else {
               const errorMessage = await response.text();
               alert(errorMessage);
            }
      } catch (error) {
            console.error("Error deleting category:", error);
         }
   }


   //função para listar todas as categorias
   function listCategories(categories) {
      const categoryTable = document.getElementById('category_table');

      categories.forEach(category => {
         
         const row = document.createElement('tr');
         row.classList.add('category_table_row');

         const titleCell = document.createElement('td');
         titleCell.textContent = category.title;
         titleCell.style.textAlign = "center";

         const descriptionCell = document.createElement('td');
         descriptionCell.textContent = category.description;
         descriptionCell.style.textAlign = "center";

         const authorCell = document.createElement('td');
         authorCell.textContent = category.author.username;
         authorCell.style.textAlign = "center";

         const editCell = document.createElement('td');
         editCell.style.textAlign = "center";
         
        const editButton = document.createElement("button");
        editButton.innerHTML = "&#128214;";
        editButton.classList.add("edit_button");
        editButton.onclick = function() {
         
         window.location.href = `edit-category.html?categoryId=${category.idCategory}`;
            
        };
        editCell.appendChild(editButton); // Adiciona o botão de edição à célula


        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "&#128465;";
        deleteButton.classList.add("delete_button");
        deleteButton.onclick = function(event) {
            
         deleteCategory(category.idCategory, sessionStorage.getItem("token"));
        };
        editCell.appendChild(deleteButton); // Adiciona o botão de exclusão à célula
        
      
         

         row.appendChild(titleCell);
         row.appendChild(descriptionCell);
         row.appendChild(authorCell);
         row.appendChild(editCell);
         

         categoryTable.appendChild(row);
      });
   }

   function removeAllRows() {
      const table = document.getElementById('category_table');
      while (table.rows.length > 1) {
         table.deleteRow(1);
      }
   }

  