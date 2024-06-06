const taskKey = '@tasks'

let selectedTaskId = null

function createTaskElement(task) {
  const li = document.createElement('li');

  li.id = `id-${task.id}`;
  li.innerHTML = `
    <div>
      <h2>${task.title}</h2>
      <p>${task.description}</p>
    </div>
    <div class="buttons-container">
      <button title="Editar tarefa" onClick="openEditDialog(${task.id})">✏️</button>
      <button title="Excluir tarefa" onClick="deleteTask(${task.id})">❌</button>
    </div>
  `;

  return li;
}

function addTask(event) {
  event.preventDefault();

  const taskId = new Date().getTime();
  const taskList = document.querySelector('#taskList');

  const form = document.querySelector('#taskForm');
  const formData = new FormData(form);

  const taskTitle = formData.get('title');
  const taskDescription = formData.get('description');

  const li = createTaskElement({
    id: taskId,
    title: taskTitle,
    description: taskDescription
  });

  taskList.appendChild(li);

  const tasks = JSON.parse(localStorage.getItem(taskKey)) || [];
  tasks.push({
    id: taskId,
    title: taskTitle,
    description: taskDescription,
  });
  localStorage.setItem(taskKey, JSON.stringify(tasks));

  form.reset();
}

function openEditDialog(taskId) {
  const tasks = JSON.parse(localStorage.getItem(taskKey)) || [];

  selectedTaskId = tasks.findIndex((task) => task.id === taskId);
  const task = tasks[selectedTaskId];

  const dialog = document.querySelector('dialog');

  const editTitle = document.querySelector('#editTaskForm #title');
  const editDescription = document.querySelector('#editTaskForm #description');

  editTitle.value = task.title;
  editDescription.value = task.description;

  dialog.showModal();
}

function closeDialog() {
  const dialog = document.querySelector('dialog');
  dialog.close();
}

function deleteTask(taskId) {
  const tasks = JSON.parse(localStorage.getItem(taskKey)) || [];
  const updatedTasks = tasks.filter(task => task.id !== taskId);

  localStorage.setItem(taskKey, JSON.stringify(updatedTasks));

  const taskElement = document.getElementById(`id-${taskId}`);
  taskElement.remove();
}

function editTask(event) {
  event.preventDefault();

  const editTitle = document.querySelector('#editTaskForm #title').value;
  const editDescription = document.querySelector('#editTaskForm #description').value;

  const tasks = JSON.parse(localStorage.getItem(taskKey)) || [];
  tasks[selectedTaskId].title = editTitle;
  tasks[selectedTaskId].description = editDescription;

  localStorage.setItem(taskKey, JSON.stringify(tasks));

  const taskElement = document.getElementById(`id-${tasks[selectedTaskId].id}`);
  taskElement.querySelector('h2').textContent = editTitle;
  taskElement.querySelector('p').textContent = editDescription;

  closeDialog();
}

window.addEventListener('DOMContentLoaded', () => {
  const tasks = JSON.parse(localStorage.getItem(taskKey)) || [];
  const taskList = document.querySelector('#taskList');

  tasks.forEach(task => {
    const taskElement = createTaskElement(task);
    taskList.appendChild(taskElement);
  });
});
