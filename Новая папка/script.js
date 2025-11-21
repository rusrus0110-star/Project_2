// Открытие и закрытие модального окна

const openModalBtn = document.getElementById("openModal");
const bottomSheet = document.querySelector(".bottom-sheet");

openModalBtn.addEventListener("click", () => {
  bottomSheet.classList.toggle("active");
});

// Кнопки фильтра

const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Удаляем active у всех
    filterButtons.forEach((b) => b.classList.remove("active"));
    // Добавляем active текущей
    btn.classList.add("active");

    const filter = btn.textContent.trim(); // "Все", "Активные", "Завершенные"
    const tasks = document.querySelectorAll(".todo-list li:not(.placeholder");

    tasks.forEach((task) => {
      const checkbox = task.querySelector(".task-checkbox");
      if (!checkbox) return;
      const isChecked = checkbox.checked;

      if (filter === "Все") {
        task.style.display = "flex";
      } else if (filter === "Активные") {
        task.style.display = !isChecked ? "flex" : "none";
      } else if (filter === "Завершенные") {
        task.style.display = isChecked ? "flex" : "none";
      }
    });
  });
});

// Установка текущей даты (вверху приложения)

window.addEventListener("DOMContentLoaded", () => {
  const dayElement = document.getElementById("current-day");
  const dateElement = document.getElementById("current-date");

  const now = new Date();

  const weekdays = [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ];
  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];

  const weekday = weekdays[now.getDay()];
  const day = now.getDate();
  const month = months[now.getMonth()];

  if (dayElement) dayElement.textContent = weekday;
  if (dateElement) dateElement.textContent = `${day} ${month}`;
});

// Ввод даты и времени

function loadFlatpickr(callback) {
  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = "https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css";
  document.head.appendChild(css);

  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/flatpickr";
  script.onload = () => {
    const localeScript = document.createElement("script");
    localeScript.src = "https://cdn.jsdelivr.net/npm/flatpickr/dist/l10n/ru.js";
    localeScript.onload = callback;
    document.head.appendChild(localeScript);
  };
  document.head.appendChild(script);
}

loadFlatpickr(() => {
  flatpickr("#datetimeDisplay", {
    enableTime: true,
    dateFormat: "d F Y, H:i",
    locale: "ru",
    time_24hr: true,
    defaultHour: 12,
    defaultMinute: 0,
  });
});

// добавление задачи

const taskForm = document.getElementById("taskForm");
const descriptionInput = document.getElementById("descriptionInput");
const datetimeDisplay = document.getElementById("datetimeDisplay");
const dateInput = document.getElementById("dateInput");
const timeInput = document.getElementById("timeInput");
const todoList = document.querySelector(".todo-list");
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const description = descriptionInput.value.trim();
  const datetime = datetimeDisplay.value.trim();
  if (!description || !datetime) {
    alert("Пожалуйста, заполните оба поля");
    return;
  }
  const task = {
    description,
    datetime,
    done: false,
  };

  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  updatePlaceholder();
  addTaskToList(task, tasks.length - 1);

  taskForm.reset();

  datetimeDisplay.value = "";
  bottomSheet.classList.remove("active");
});

// Добавление задачи в ul

function addTaskToList(task, index) {
  const li = document.createElement("li");
  const isChecked = task.done ? "checked" : "";
  li.innerHTML = `

    <input type="checkbox" class="task-checkbox" ${isChecked}/>

    <span class="task-text">${task.description} — ${task.datetime}</span>

  `;
  const checkbox = li.querySelector(".task-checkbox");
  checkbox.checked = task.done;
  checkbox.addEventListener("change", () => {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    tasks[index].done = checkbox.checked;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });

  todoList.appendChild(li);
}

// При загрузке — вывести сохранённые задачи

window.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("tasks") || "[]");

  saved.forEach((task, index) => addTaskToList(task, index));
});

// кнопка отмена

const resetBottom = document.querySelector("#resetButton");
resetBottom.addEventListener("click", () => {
  bottomSheet.classList.remove("active");
});

//поиск

const searchInput = document.querySelector(".search-wrapper input");

searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();
  const tasks = document.querySelectorAll(".todo-list li:not(.placeholder");

  tasks.forEach((task) => {
    const text = task.querySelector(".task-text").textContent.toLowerCase();
    if (text.includes(searchTerm)) {
      task.style.display = "";
    } else {
      task.style.display = "none";
    }
  });
});
// после добавления первой задачи убираем "Пока новых задач нет"
function updatePlaceholder() {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  const placeholder = document.querySelector(".placeholder");

  if (tasks.length === 0) {
    placeholder.style.display = "block";
  } else {
    placeholder.style.display = "none";
  }
}
