// ****** select items **********

const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");
// edit option
let editElement;
let editFlag = false;
let editID = "";

// ****** event listeners **********

// submit form
form.addEventListener("submit", addItem);
// clear list
clearBtn.addEventListener("click", clearItems);
// display items onload
window.addEventListener("DOMContentLoaded", setupItems);

// ****** functions **********

// add item
function addItem(e) {
  e.preventDefault();
  const value = grocery.value.trim();
  const id = new Date().getTime().toString();

  const items = Array.from(document.querySelectorAll(".grocery-item .title")).map(
    (item) => item.textContent
  );

  if (items.includes(value) && !editFlag) {
    displayAlert("Item already added", "danger");
    return;
  }

  if (value !== "" && !editFlag) {
    createListItem(id, value);
    // display alert
    displayAlert("Item added to the list", "success");
    // show container
    container.classList.add("show-container");
    // set local storage
    addToLocalStorage(id, value);
    // sort items
    sortItems();
    // set back to default
    setBackToDefault();
  } else if (value !== "" && editFlag) {
    editElement.innerHTML = value;
    displayAlert("Value changed", "success");

    // edit local storage
    editLocalStorage(editID, value);
    setBackToDefault();
    sortItems();
  } else {
    displayAlert("Please enter a value", "danger");
  }
}

// display alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  // remove alert
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

// clear items
function clearItems() {
  if (confirm("Are you sure you want to clear the entire list?")) {
    const items = document.querySelectorAll(".grocery-item");
    if (items.length > 0) {
      items.forEach((item) => list.removeChild(item));
    }
    container.classList.remove("show-container");
    displayAlert("List cleared", "danger");
    setBackToDefault();
    localStorage.removeItem("list");
  }
}

// delete item
function deleteItem(e) {
  if (confirm("Are you sure you want to delete this item?")) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;

    list.removeChild(element);

    if (list.children.length === 0) {
      container.classList.remove("show-container");
    }
    displayAlert("Item removed", "danger");

    setBackToDefault();
    // remove from local storage
    removeFromLocalStorage(id);
  }
}

// edit item
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "Update";
}

// set back to defaults
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "Add";
}

// sort items alphabetically
function sortItems() {
  const items = Array.from(list.children);
  items.sort((a, b) => {
    const textA = a.querySelector(".title").textContent.toLowerCase();
    const textB = b.querySelector(".title").textContent.toLowerCase();
    return textA.localeCompare(textB);
  });
  items.forEach((item) => list.appendChild(item));
}

// ****** local storage **********

// add to local storage
function addToLocalStorage(id, value) {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter((item) => item.id !== id);
  localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map((item) => (item.id === id ? { ...item, value } : item));
  localStorage.setItem("list", JSON.stringify(items));
}

// ****** setup items **********

function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach((item) => createListItem(item.id, item.value));
    container.classList.add("show-container");
    sortItems();
  }
}

function createListItem(id, value) {
  const element = document.createElement("article");
  let attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.classList.add("grocery-item");
  element.innerHTML = `
    <input type="checkbox" class="checkbox" />
    <p class="title">${value}</p>
    <div class="btn-container">
      <!-- edit btn -->
      <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
      <!-- delete btn -->
      <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);
  list.appendChild(element);
}
