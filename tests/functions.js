async function addTask(token,title, description, initialDate, endDate, priority, idCategory) {
   let task = {
      title: title,
      description: description,
      initialDate: initialDate,
      endDate: endDate,
      priority: priority
   };
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
   return response.status;
}

module.exports = {
   addTask
}