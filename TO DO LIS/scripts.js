$(document).ready(function () {
  console.log("Usando JQuery correctamente.");

  const list = $("#todo-list");
  const form = $("#todo-form");
  const input = $("#todo-input");
  const progress = $(".progress");

  //Cargar tareas al localstorage
  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    list.empty();
    tasks.forEach(function (task, index) {
      const taskItem = $(
        `<li>
          <input type="checkbox" class="task-checkbox"
          data-index="${index}" ${task.completed ? "checked" : ""}>
          <span class="task-text ${task.completed ? "completed" : ""}">${
          task.text
        }</span>
          <button class="delete-btn" data-index="${index}">Eliminar</button>
          </li>`
      );
      list.append(taskItem);
    });

    // Verificar si hay tareas y oculta el mensaje "sin tareas"
    if (tasks.length > 0) {
      $("#vacio").hide();
    } else {
      $("#vacio").show();
    }

    // Actualizar el progreso
    updateProgress();
  }

  //Se guardaran las tareas en el local
  function saveTask(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  //Funcion para agregar tarea al hacer submit
  form.submit(function (e) {
    e.preventDefault();
    const inputValue = input.val().trim();

    if (inputValue) {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const newTask = { text: inputValue, completed: false }; //Guardar estado de tarea
      tasks.push(newTask);
      saveTask(tasks);

      input.val("");
      loadTasks();
      console.log("Tarea Agregada:", inputValue);
    }
  });

  //Editar tarea al hacer doble clic
  list.on("dblclick", ".task-text", function () {
    const span = $(this);
    const index = span.siblings(".task-checkbox").data("index");
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const currentText = tasks[index].text;
    const inputEdit = $(
      `<input type="text" class="edit-input" value="${currentText}">`
    );

    span.replaceWith(inputEdit);
    inputEdit.focus();

    function saveEdit() {
      const newText = inputEdit.val().trim();
      if (newText) {
        tasks[index].text = newText;
        saveTask(tasks);
        const newSpan = $(
          `<span class="task-text ${
            tasks[index].completed ? "completed" : ""
          }">${newText}</span>`
        );
        inputEdit.replaceWith(newSpan);
      } else {
        inputEdit.replaceWith(
          `<span class="task-text ${
            tasks[index].completed ? "completed" : ""
          }">${currentText}</span`
        );
      }
    }

    inputEdit.on("blur", saveEdit);
    inputEdit.on("keydown", function (e) {
      if (e.key === "Enter") {
        saveEdit();
      }
    });
  });

  //Funcion para eliminar tarea
  list.on("click", ".delete-btn", function () {
    const index = $(this).data("index");
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.splice(index, 1); //Eliminar tarea
    saveTask(tasks);
    loadTasks(); //Recargar la lista
  });

  //Funcion para marcar tarea como completada
  list.on("change", ".task-checkbox", function () {
    const index = $(this).data("index");
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks[index].completed = $(this).prop("checked"); //Actualizar el estado de la tarea

    //Guardar el cambio en el localStorage
    saveTask(tasks);

    //Actualizar solo el span de esta tarea
    const span = $(this).siblings(".task-text");
    if (tasks[index].completed) {
      span.addClass("completed");
    } else {
      span.removeClass("completed");
    }

    updateProgress();
  });

  //Funcion para actualizar el contador de progreso
  function updateProgress() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const completedTasks = tasks.filter((task) => task.completed).length;
    const totalTasks = tasks.length;

    progress.text(`${completedTasks}/${totalTasks} completadas`);
  }

  loadTasks();
});
