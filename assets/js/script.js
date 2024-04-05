// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Function to generate a unique task id
function generateTaskId() {
    // Found crypto on one of the previous assignments
    return crypto.randomUUID();
}

// Function to create a task card
function createTaskCard(task)
 {
    const taskCard = $('<div>').addClass('task-card card').attr('data-task-id', task.id);
    const cardBody = $('<div>').addClass('card-body');
    cardBody.append($('<h5>').addClass('card-title').text(task.title));
    cardBody.append($('<p>').addClass('card-text').text(task.description));
    cardBody.append($('<p>').addClass('card-text').text('Due: ' + task.deadline));
    const deleteButton = $('<button>').addClass('btn btn-danger delete-task').text('Delete').attr('data-task-id', task.id).on('click', handleDeleteTask);

    cardBody.append(deleteButton);
    taskCard.append(cardBody);

    return taskCard;
}

// Function to render the task list and make cards draggable
function renderTaskList() 
{
    $('#to-do-cards, #in-progress-cards, #done-cards').empty();

    // For each loop to make the task cards (function right above)
    taskList.forEach(task => {
        const taskCard = createTaskCard(task);
        $('#' + task.status + '-cards').append(taskCard);
    });

    makeTasksDraggable();
}

// Function to handle adding a new task
function handleAddTask(event) 
{
    event.preventDefault();
    const title = $('#taskTitle').val();
    const description = $('#taskDescription').val();
    const deadline = $('#taskDeadline').val();
    const task = {
        id: generateTaskId(),
        title: title,
        description: description,
        deadline: deadline,
        status: 'to-do'
    };

    taskList.push(task);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", JSON.stringify(nextId));
    renderTaskList();

    // Reset my modal
    $('#taskForm')[0].reset();
    $('#formModal').modal('hide');
}

// Function to handle deleting a task
function handleDeleteTask() 
{
    const taskId = $(this).data('task-id');
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));

    renderTaskList();
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) 
{
    const taskId = ui.draggable.data('task-id');
    const newStatus = $(this).attr('id').replace('-cards', '');
    const task = taskList.find(task => task.id === taskId);

    if (task) {
        task.status = newStatus;
        localStorage.setItem("tasks", JSON.stringify(taskList));
        renderTaskList();
    }
}

// Make tasks draggable
function makeTasksDraggable() 
{
    $(".task-card").draggable({
        helper: "clone",
        revert: "invalid",
        opacity: 0.7,
        start: function(event, ui) {
            // The cards were rendering behind the lists so I changed the z-index here
            ui.helper.css('z-index', 100); 
        },
        stop: function(event, ui) {
            // Then reset the z-index when it's done
            ui.helper.css('z-index', 'auto');
        }
    });
}


// Make task board when the document is ready
$(document).ready(function () 
{

    renderTaskList();
    $('#taskForm').submit(handleAddTask);
    $(".lane").droppable({
        drop: handleDrop,
        accept: ".task-card"
    });

    $('#taskDeadline').datepicker();
});
