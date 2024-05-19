const itemForm = document.getElementById("item-form");
const item = document.getElementById("item");
const small = document.querySelector("small");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const filter = document.getElementById("filter");

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  clearUI();
}

// Add an item to the list with the classes and button with icon also with classes
function addItem(e) {
  e.preventDefault();

  const itemValue = item.value.trim().toLowerCase();

  // Check if input is empty
  if (itemValue === "") {
    small.style.display = "block";
    item.classList.add("form-input");
  } else if (isDuplicate(itemValue)) {
    alert("This item already exists!");
    clearUI();
  } else {
    small.style.display = "none";
    item.classList.remove("form-input");

    // Add item to DOM
    addItemToDOM(itemValue);

    // Add item to Local Storage
    addItemToStorage(itemValue);

    // Clear the input box and update UI
    clearUI();
  }
}

function addItemToDOM(item) {
  const newItem = createListItem(
    "flex items-center justify-between bg-slate-400 rounded-sm shadow-md px-3 py-2 text-lg text-white font-semibold sm:w-[175px]"
  );
  newItem.textContent = item;
  newItem.appendChild(
    createButton(
      "remove-item text-red-600 hover:text-red-500 hover:scale-125 transition"
    )
  );
  itemList.appendChild(newItem);
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.push(item);

  // Convert to JSON String and set to local strorage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage = [];
  if (localStorage.getItem("items") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }

  return itemsFromStorage;
}

function isDuplicate(value) {
  const items = itemList.querySelectorAll("li");
  for (let item of items) {
    if (item.firstChild.textContent.toLowerCase() === value) {
      return true;
    }
  }
  return false;
}

function createListItem(classes) {
  const li = document.createElement("li");
  li.classList.add(...classes.split(" "));
  return li;
}

function createButton(classes) {
  const button = document.createElement("button");
  button.classList.add(...classes.split(" "));
  button.appendChild(createIcon("fa-solid fa-xmark"));
  return button;
}

function createIcon(classes) {
  const icon = document.createElement("i");
  icon.classList.add(...classes.split(" "));
  return icon;
}

function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  clearUI(); // Update UI after clearing items
}

function clearUI() {
  item.value = "";

  // Check if there are any items left in the list
  const items = itemList.querySelectorAll("li");
  if (items.length === 0) {
    clearBtn.style.display = "none";
    filter.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    filter.style.display = "block";
  }
}

function onClickItem(e) {
  if (e.target.contains("remove-item")) {
    removeItem(e.target.parentElement);
  }
}

// Remove item function
function removeItem(e) {
  if (
    e.target.classList.contains("fa-xmark") ||
    e.target.classList.contains("remove-item")
  ) {
    const li = e.target.closest("li");
    if (li) {
      const itemText = li.firstChild.textContent.trim().toLowerCase();

      // Remove item from DOM
      itemList.removeChild(li);

      // Remove item from storage
      removeItemFromStorage(itemText);
      clearUI(); // Update UI after removing item
    }
  }
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();

  // Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  // Re-set to local
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

// Filter items function
function filterItems(e) {
  const filterText = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll("li");

  items.forEach((item) => {
    const itemText = item.firstChild.textContent.toLowerCase();
    if (itemText.indexOf(filterText) !== -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

// Initialize app
function init() {
  // Event Listeners
  itemForm.addEventListener("submit", addItem);
  clearBtn.addEventListener("click", onClickItem);
  itemList.addEventListener("click", removeItem);
  filter.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);

  clearUI();
}

init();
