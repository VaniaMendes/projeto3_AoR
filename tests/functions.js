async function addTask(token,title, description, initialDate, endDate, priority, idCategory) {
   let task = {
      title: title,
      description: description,
      initialDate: initialDate,
      endDate: endDate,
      priority: priority
   };
   try{
   const response = await fetch("http://localhost:8080/project_backend/rest/tasks/createTask", {
      method: "POST",
      headers: {
         Accept: "*/*",
         "Content-Type": "application/json",
         token: token,
         categoryId: idCategory
         
      },
      body: JSON.stringify(task),
   });
   if (!response.ok) {
      return response.status;
   }

   return 200;
}catch (error) {
   console.error("Error adding task:", error);
   return null;
}
}





module.exports = {
   addTask
   
}