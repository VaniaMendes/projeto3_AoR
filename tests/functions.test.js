const tester = require("./functions");


test("Task rejected with invalid token", async () => {
   const response = await tester.addTask("invalidToken", "nova tarefa", "12345", "2024-03-05" , "2024-05-30", 200, "toDo", 1709295172327);
   expect(response).not.toBe(200);
});

test("Task rejected with invalid initial date", async () => {
   const response = await tester.addTask("slgsucrZm_6Ug7QSKg3_GEuzfSXJqq3T", "nova tarefa", "12345", "2023-03-05" , "2024-05-30", 200, 1709295172327);
   expect(response).not.toBe(200);
});


test("Task rejected with empty title", async () => {
   const response = await tester.addTask("slgsucrZm_6Ug7QSKg3_GEuzfSXJqq3T", "", "12345", "2024-03-05" , "2024-05-30", 200, 1709316267443);
   expect(response).not.toBe(200);
});

test("Task rejected with invalid category ID", async () => {
   const response = await tester.addTask("slgsucrZm_6Ug7QSKg3_GEuzfSXJqq3T", "nova tarefa", "12345", "2024-03-05" , "2024-05-30", 200, "invalidCategoryID");
   expect(response).not.toBe(200);
});

test("Task rejected with invalid priority", async () => {
   const response = await tester.addTask("slgsucrZm_6Ug7QSKg3_GEuzfSXJqq3T", "nova tarefa", "12345", "2024-03-05" , "2024-05-30", 400, 1709316267443);
   expect(response).not.toBe(200);
});


test("Task rejected with end date before start date", async () => {
   const response = await tester.addTask("slgsucrZm_6Ug7QSKg3_GEuzfSXJqq3T", "nova tarefa", "Descrição da nova tarefa", "2024-05-05" , "2024-05-30", 200, 1709316267443);
   expect(response.status).toBe(200);
});
