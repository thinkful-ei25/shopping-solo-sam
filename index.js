'use strict';
/*eslint-env jquery */

const STORE = {
    items: [
        {name: 'apples', checked: false},
        {name: 'oranges', checked: false},
        {name: 'milk', checked: true},
        {name: 'bread', checked: false}
    ],
    hideCompleted: false,
    searchTerm : ''
};


function generateItemElement(item, itemIndex) {
    return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <form class="js-edit-form hidden">
            <input type="text" name="edit-list-entry" class="edit-input-${itemIndex}" placeholder="Enter edit...">
            <button type="submit" class="js-submit-edit">Confirm?</button>
      </form>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
        <button class="shopping-item-edit js-item-edit">
            <span class="button-label">edit</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
    console.log('Generating shopping list element');
    
    const items = shoppingList.map((item, index) => generateItemElement(item, index));
    
    return items.join('');
}


function renderShoppingList() {
    //filterd by checked
    let filteredItems = [ ...STORE.items ];
    if(STORE.hideCompleted)filteredItems = filteredItems.filter(item => !item.checked);
    let filteredSearchItems = filteredItems.filter(item => item.name.includes(STORE.searchTerm));
    console.log('`renderShoppingList` ran');
    const shoppingListItemsString = generateShoppingItemsString(filteredSearchItems);
    $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
    console.log(`Adding "${itemName}" to shopping list`);
    STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
    $('#js-shopping-list-form').submit(function(event) {
        event.preventDefault();
        console.log('`handleNewItemSubmit` ran');
        const newItemName = $('.js-shopping-list-entry').val();
        if(newItemName === '') return;
        $('.js-shopping-list-entry').val('');
        addItemToShoppingList(newItemName);
        renderShoppingList();
    });
}

function searchShoppingList(itemName){
    STORE.searchTerm = itemName;
} 

function handleItemSearch(){
    $('#js-shopping-list-form-search').submit(function(event) {
        event.preventDefault();
        console.log('`handleItemSearch` ran');
        const searchName = $('.js-shopping-list-search').val();
        $('.js-shopping-list-search').val('');
        searchShoppingList(searchName);
        renderShoppingList();
    });
}

function toggleHideItems(){
    STORE.hideCompleted= !STORE.hideCompleted;
}

function handleToggleHideClick(){
    $('#toggle-completed-filter').click(() => {
        toggleHideItems();
        console.log('Toggled completed items');
        renderShoppingList();
    });
}

function toggleCheckedForListItem(itemIndex) {
    console.log('Toggling checked property for item at index ' + itemIndex);
    STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}


function getItemIndexFromElement(item) {
    const itemIndexString = $(item)
        .closest('.js-item-index-element')
        .attr('data-item-index');
    return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
    $('.js-shopping-list').on('click', '.js-item-toggle', event => {
        console.log('`handleItemCheckClicked` ran');
        const itemIndex = getItemIndexFromElement(event.currentTarget);
        toggleCheckedForListItem(itemIndex);
        renderShoppingList();
    });
}


function removeListItem(itemIndex){
    console.log('Removing item from shopping list at index' + itemIndex);
    STORE.items.splice(itemIndex,1);
}

function handleDeleteItemClicked() {
    $('.js-shopping-list').on('click', '.js-item-delete', event => {
        console.log('`handleDeleteItemClicked` ran');
        const itemIndex = getItemIndexFromElement(event.currentTarget);
        removeListItem(itemIndex);
        renderShoppingList();
    });
    
}

// user clicks edit to prompt edit input
// user puts in new item name to edit
// user clicks edit item button to confirm changes
// item name edited and updated

function editListItem(name,index){
    console.log('Editing item in shopping list at index ' + index);
    STORE.items[index].name = name;
}



function handleOpenEditItemClicked(){
    $('.js-shopping-list').on('click', '.js-item-edit', event => {
        console.log('`handleOpenEditItemClicked` ran');
        const hiddenForm = $(event.currentTarget).closest('li').find('.hidden');
        hiddenForm.removeClass('hidden');
    });
}


function handleSubmitEditItemClicked(){
    $('.js-shopping-list').on('click', '.js-submit-edit', event => {
        event.preventDefault();
        console.log('`handleSubmitEditItemClicked` ran');
        const itemIndex = getItemIndexFromElement(event.currentTarget);
        const editedName = $('.edit-input-'+itemIndex).val();
        if(editedName === '') {renderShoppingList();return;}
        console.log(editedName);
        editListItem(editedName,itemIndex);
        renderShoppingList();
    });
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
    renderShoppingList();
    handleNewItemSubmit();
    handleItemSearch();
    handleItemCheckClicked();
    handleDeleteItemClicked();
    handleToggleHideClick();
    handleOpenEditItemClicked();
    handleSubmitEditItemClicked();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);