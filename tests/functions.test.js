// Importe a função addTask do arquivo tasks.js
const tasks = require('./functions');

// Mock da função fetch()
global.fetch = jest.fn(() => Promise.resolve({
  status: 200,
  json: () => Promise.resolve({ message: 'Task created successfully.' }),
}));

// Defina os casos de teste para a função addTask
describe('addTask', () => {
  test('add task with sucess', async () => {
    const response = await tasks.addTask('token', 'Título da Tarefa', 'Descrição da Tarefa', '2023-02-12', '2023-02-15', 3, 1);

    expect(response).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/project_backend/rest/tasks/createTask', {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
        token: 'token',
        categoryId: 1
      },
      body: JSON.stringify({
        title: 'Título da Tarefa',
        description: 'Descrição da Tarefa',
        initialDate: '2023-02-12',
        endDate: '2023-02-15',
        priority: 3
      })
    });
  });

  test('empty ttitle', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      status: 422,
      json: () => Promise.resolve({ message: 'Incapaz de criar tarefa.' }),
    }));

    const response = await tasks.addTask('token', '', 'Descrição da Tarefa', '2023-02-12', '2023-02-15', 3, 1);

    expect(response).toBe(422);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/project_backend/rest/tasks/createTask', {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
        token: 'token',
        categoryId: 1
      },
      body: JSON.stringify({
        title: '',
        description: 'Descrição da Tarefa',
        initialDate: '2023-02-12',
        endDate: '2023-02-15',
        priority: 3
      })
    });
  });


test('invalid initial date', async () => {
   global.fetch = jest.fn(() => Promise.resolve({
     status: 422,
     json: () => Promise.resolve({ message: 'Incapaz de criar tarefa.' }),
   }));

   const response = await tasks.addTask('token', '', 'Descrição da Tarefa', '2023-02-12', '2023-02-15', 3, 1);

   expect(response).toBe(422);
   expect(fetch).toHaveBeenCalledTimes(1);
   expect(fetch).toHaveBeenCalledWith('http://localhost:8080/project_backend/rest/tasks/createTask', {
     method: 'POST',
     headers: {
       Accept: '*/*',
       'Content-Type': 'application/json',
       token: 'token',
       categoryId: 1
     },
     body: JSON.stringify({
       title: '',
       description: 'Descrição da Tarefa',
       initialDate: '2023-02-12',
       endDate: '2023-02-15',
       priority: 3
     })
   });
 });

 test('invalid priority', async () => {
   global.fetch = jest.fn(() => Promise.resolve({
     status: 422,
     json: () => Promise.resolve({ message: 'Incapaz de criar tarefa.' }),
   }));

   const response = await tasks.addTask('token', '', 'Descrição da Tarefa', '2023-02-12', '2023-02-15', 3, 1);

   expect(response).toBe(422);
   expect(fetch).toHaveBeenCalledTimes(1);
   expect(fetch).toHaveBeenCalledWith('http://localhost:8080/project_backend/rest/tasks/createTask', {
     method: 'POST',
     headers: {
       Accept: '*/*',
       'Content-Type': 'application/json',
       token: 'token',
       categoryId: 1
     },
     body: JSON.stringify({
       title: '',
       description: 'Descrição da Tarefa',
       initialDate: '2023-02-12',
       endDate: '2023-02-15',
       priority: 3
     })
   });
 });

 test('invalid token', async () => {
   global.fetch = jest.fn(() => Promise.resolve({
     status: 403,
     json: () => Promise.resolve({ message: 'Token inválido.' }),
   }));
 
   const response = await tasks.addTask('invalidtoken', 'Título da Tarefa', 'Descrição da Tarefa', '2023-02-12', '2023-02-15', 3, 1);
 
   expect(response).toBe(403);
   expect(fetch).toHaveBeenCalledTimes(1);
   expect(fetch).toHaveBeenCalledWith('http://localhost:8080/project_backend/rest/tasks/createTask', {
     method: 'POST',
     headers: {
       Accept: '*/*',
       'Content-Type': 'application/json',
       token: 'invalidtoken',
       categoryId: 1
     },
     body: JSON.stringify({
       title: 'Título da Tarefa',
       description: 'Descrição da Tarefa',
       initialDate: '2023-02-12',
       endDate: '2023-02-15',
       priority: 3
     })
   });
 });

});
 
