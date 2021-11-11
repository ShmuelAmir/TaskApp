$(document).ready(function(){
    $('#add-task').click(() => {
        addTask();
    });
    
    $('.txt').keypress((event) => {
        if(event.keyCode == '13')
            addTask();
    });

    $(document).on('change','#cal-input', function(){
       $(this).addClass('changed-date');
    });

    $(document).on('click','#edit', function(){
        const txtDiv =  $(this).prevAll('div');
        txtDiv.attr('contenteditable', 'true');
        txtDiv.focus();
    });

    $(document).on('blur','.up-txt', function(){
        $(this).attr('contenteditable', 'false');
    });

    $(document).on('click', '#check', function(){
        $(this).parent().toggleClass('complete');
    });

    $(document).on('click', '#delete', function(){
        $(this).parent().remove();
    });

    $(document).on('dragstart', '.task-in-progress', function(e){
        $(this).addClass('dragging');
    });

    $(document).on('dragend', '.task-in-progress', function(){
        $(this).removeClass('dragging');
    });

    $('.tasks').on('dragover', function(e){
        e.preventDefault();
        const draggable = $('.dragging');
        const afterElemnet = getDragAfterElement(e.clientY);
        if (afterElemnet == null) {
            $(this).append(draggable);
        } else {
            draggable.insertBefore(afterElemnet);
        }
    });
});

/**
 * add the text from 'new-task' input to the task list
 */
function addTask(){
    let txt = $('.txt');
    let newText = txt.val();

    if (newText != ''){
        let task = $('<div/>', {class: "task task-in-progress", draggable: "true"});
        let input = $('<div/>', {class: "up-txt", contenteditable: "false"}).text(newText);

        let calInput = $('<input/>', {id: 'cal-input', type: 'datetime-local'});
        let editBtn = $('<i/>', {class: "fas fa-pencil-alt", id: "edit"});
        let deleteBtn = $('<i/>', {class: "far fa-trash-alt", id: "delete"});
        let checkBtn = $('<i/>', {class: "fas fa-check", id: "check"});
        
        $('.tasks').prepend(task.append(checkBtn, input, calInput, editBtn, deleteBtn));
        
        txt.val('');
    }
}

/**
 * determines the position of the dragging element
 * @param {*} y - the y position of the mouse
 * @returns the element to insert before him
 */
function getDragAfterElement(y) {
    const draggables = [...$('.task-in-progress:not(.dragging)')];
    
    return draggables.reduce( (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
