const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
    const itemsInStorage = getItemFromLS(); 

    itemsInStorage.forEach(item => addItemToDOM(item));
}

function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;

    if (newItem=== '') {
        alert('Please add an item');
        return;
    }

    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');
        removeItemFromLS(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    } else {
        if (checkIfItemExists(newItem)){
            alert('That item already exists');
            return;
        }
    }

    addItemToDOM(newItem);
    addItemToLS(newItem)    
}

function addItemToDOM(item) {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);

    itemList.appendChild(li);
    checkUI();
    itemInput.value = '';
}

function addItemToLS(item) {
    let itemsInStorage = getItemFromLS(); 
    
    // Push new item to array
    itemsInStorage.push(item);
    
    // stringify to store new array in LS
    localStorage.setItem('items', JSON.stringify(itemsInStorage));
}

function getItemFromLS(item) {
    let itemsInStorage;
    
    // Check if there are items in Local Storage, parse as array
    if (localStorage.getItem('items') === null) {
        itemsInStorage = [];
    } else {
        itemsInStorage = JSON.parse(localStorage.getItem('items'))
    }

    return itemsInStorage;
}

function removeItemFromLS(item) {
    let itemsInStorage = getItemFromLS(); 

    itemsInStorage = itemsInStorage.filter(i => i !== item);

    localStorage.setItem('items', JSON.stringify(itemsInStorage));
}

function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon(classes) { 
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function onClickItem(e) {
    if (e.target.tagName === "I") {
        removeItem(e.target.parentElement.parentElement);
    } else if (e.target.tagName === "LI"){
        setItemToEdit(e.target);
    }
}

function checkIfItemExists(item) {
    const itemsInStorage = getItemFromLS();
    return itemsInStorage.includes(item)
}

function setItemToEdit(item) {
    isEditMode = true;

    itemList
        .querySelectorAll('li')
        .forEach(li => li.classList.remove('edit-mode'));

    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent;
}

function removeItem(item) {
    if (confirm('Are you sure?')) {
        item.remove();

        removeItemFromLS(item.textContent);

        checkUI();
    }
}

function clearAll() {
    while (itemList.firstChild) {
        itemList.firstChild.remove();
    }

    localStorage.removeItem('items');

    checkUI();
}

function filterItems(e) {
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase();
        if (itemName.indexOf(text) != -1) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });

}

function checkUI() {
    itemInput.value = '';

    const items = itemList.querySelectorAll('li');
    if (items.length === 0) {
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    } else {
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }
    
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';

    isEditMode = false;
}

function init() {
    // Event Listeners
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', clearAll);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);    
    checkUI();
}

init();
