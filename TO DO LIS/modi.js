$(document).ready(function () {
  console.log("Usando JQuery correctamente.");

  const list = $("#todo-list");
  const form = $("#todo-form");
  const input = $("#todo-input");
  const progress = $(".progress");

  //Cargar tareas al localStorage
  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    list.empty();
    tasks.forEach(function (task, index) {
      const taskItem = $(`
          <li>
            <input type="checkbox" class="task-checkbox" data-index="${index}" ${
        task.completed ? "checked" : ""
      }>
            <span class="task-text ${task.completed ? "completed" : ""}">${
        task.text
      }</span>
            <button class="delete-btn" data-index="${index}">Eliminar</button>
          </li>
        `);
      list.append(taskItem);
    });

    // Verifica si hay tareas y oculta el mensaje "sin tareas"
    if (tasks.length > 0) {
      $("#vacio").hide();
    } else {
      $("#vacio").show();
    }

    // Actualizar el progreso
    updateProgress();
  }

  //Se guardarán las tareas en el local
  function saveTask(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Funcion para agregar tarea al hacer submit
  form.submit(function (e) {
    e.preventDefault();
    const inputValue = input.val().trim();

    if (inputValue) {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const newTask = { text: inputValue, completed: false }; // Guardar estado de tarea
      tasks.push(newTask);
      saveTask(tasks);

      // Agregar la tarea a la lista visual
      const taskItem = $(`
          <li>
            <input type="checkbox" class="task-checkbox" data-index="${
              tasks.length - 1
            }">
            <span class="task-text">${inputValue}</span>
            <button class="delete-btn">Eliminar</button>
          </li>
        `);
      list.append(taskItem);
      input.val(""); // Limpiar el campo de entrada
      console.log("Tarea agregada:", inputValue);
    }
  });

  // Función para eliminar tarea
  list.on("click", ".delete-btn", function () {
    const index = $(this).data("index");
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.splice(index, 1); // Eliminar la tarea
    saveTask(tasks);
    loadTasks(); // Recargar la lista
  });

  // Función para marcar tarea como completada
  list.on("change", ".task-checkbox", function () {
    const index = $(this).data("index");
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks[index].completed = $(this).prop("checked"); // Actualizar el estado de la tarea

    saveTask(tasks); // Guardar los cambios en localStorage
    updateProgress(); // Actualizar el progreso
    loadTasks(); // Recargar la lista
  });

  // Función para actualizar el contador de progreso
  function updateProgress() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const completedTasks = tasks.filter((task) => task.completed).length;
    const totalTasks = tasks.length;

    progress.text(`${completedTasks}/${totalTasks} completadas`);
  }

  // Cargar las tareas al cargar la página
  loadTasks();
});
