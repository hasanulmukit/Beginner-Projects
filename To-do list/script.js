    document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const filterTasks = document.getElementById('filter-tasks');
    const exportBtn = document.getElementById('export-btn'); 
  
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const deletedTasks = []; // Store deleted tasks
  
    savedTasks.forEach((task) => addTaskToList(task.text, task.completed));
  
    todoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const task = todoInput.value.trim();
      if (task) {
        addTaskToList(task, false);
        saveTask(task, false);
        todoInput.value = '';
      }
    });
  
    todoList.addEventListener('click', (e) => {
      const taskItem = e.target.closest('li');
      const taskText = taskItem?.querySelector('.task-text')?.textContent;
    
      // Handle delete button
      if (e.target.closest('.delete-btn')) {
        removeTaskFromStorage(taskText);
        deletedTasks.push({ text: taskText, status: 'Deleted' });
        taskItem.remove();
      }
      // Handle edit button
      else if (e.target.closest('.edit-btn')) {
        const newTask = prompt('Edit Task:', taskText);
        if (newTask && newTask.trim()) {
          updateTaskInStorage(taskText, newTask.trim());
          taskItem.querySelector('.task-text').textContent = newTask;
        }
      }
      // Handle completion toggle
      else if (e.target.classList.contains('completion-circle')) {
        const isCompleted = e.target.classList.toggle('completed');
        taskItem.querySelector('.task-text').classList.toggle('completed', isCompleted);
        updateCompletionStatus(taskText, isCompleted);
      }
    });
    
  
    filterTasks.addEventListener('change', (e) => {
      const filter = e.target.value;
      Array.from(todoList.children).forEach((taskItem) => {
        const isCompleted = taskItem.querySelector('.task-text').classList.contains('completed');
        if ((filter === 'completed' && !isCompleted) || (filter === 'incomplete' && isCompleted)) {
          taskItem.style.display = 'none';
        } else {
          taskItem.style.display = '';
        }
      });
    });
  
    exportBtn.addEventListener('click', () => {
      const date = new Date();
      const fileName = `${date.toISOString().split('T')[0]}.txt`;
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      const header = `To-Do List\nDate: ${date.toLocaleDateString()} (${dayOfWeek})\n\n`;
  
      let content = header + "Tasks:\n";
      savedTasks.forEach((task) => {
        content += `- ${task.text} [${task.completed ? 'Completed' : 'Incomplete'}]\n`;
      });
  
      if (deletedTasks.length > 0) {
        content += "\nDeleted Tasks:\n";
        deletedTasks.forEach((task) => {
          content += `- ${task.text} [${task.status}]\n`;
        });
      }
  
      const blob = new Blob([content], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    });
    
    function addTaskToList(task, completed) {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <span class="completion-circle ${completed ? 'completed' : ''}"></span>
        <span class="task-text ${completed ? 'completed' : ''}">${task}</span>
        <div class="icon-btn edit-btn" data-tooltip="Edit">
          <img src="./icons/edit-icon.svg" alt="Edit" />
        </div>
        <div class="icon-btn delete-btn" data-tooltip="Delete">
          <img src="./icons/delete-icon.svg" alt="Delete" />
        </div>
      `;
      todoList.appendChild(listItem);
    }
    
      
  
    function saveTask(task, completed) {
      savedTasks.push({ text: task, completed });
      localStorage.setItem('tasks', JSON.stringify(savedTasks));
    }
  
    function removeTaskFromStorage(task) {
      const index = savedTasks.findIndex((t) => t.text === task);
      if (index > -1) {
        savedTasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(savedTasks));
      }
    }
  
    function updateTaskInStorage(oldTask, newTask) {
      const index = savedTasks.findIndex((t) => t.text === oldTask);
      if (index > -1) {
        savedTasks[index].text = newTask;
        localStorage.setItem('tasks', JSON.stringify(savedTasks));
      }
    }
  
    function updateCompletionStatus(task, completed) {
      const index = savedTasks.findIndex((t) => t.text === task);
      if (index > -1) {
        savedTasks[index].completed = completed;
        localStorage.setItem('tasks', JSON.stringify(savedTasks));
      }
    }
  });
  