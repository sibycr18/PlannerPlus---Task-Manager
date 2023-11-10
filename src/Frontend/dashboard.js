var selector, elems, makeActive;
selector = '.action-list li';
elems = document.querySelectorAll(selector);

// Add 'active' class to the first element
elems[0].classList.add('active');
makeActive = function () {
    for (var i = 0; i < elems.length; i++)
        elems[i].classList.remove('active');
    this.classList.add('active');
};

for (var i = 0; i < elems.length; i++)
    elems[i].addEventListener('mousedown', makeActive);

document.addEventListener('DOMContentLoaded', function () {
    const pendingButton = document.getElementById('pending');
    const completedButton = document.getElementById('completed');

    // pendingButton.addEventListener('click', function (event) {
    //     pendingButton.classList.add("active");
    //     alert("clicked:" + this.id);
    // });
});

// document.addEventListener('DOMContentLoaded', function() {
//     // Function to fetch and render uncompleted tasks
//     function loadTasks() {
//         url = `https://planner-plus-server-c35af645f504.herokuapp.com/api/tasks/pending/${window.user_id}`
//         console.log(url)

//         // Make a GET request to the backend endpoint
//         fetch(url)
//             .then(response => response.json())
//             .then(uncompletedTasks => {
//                 // Call a function to render the tasks immediately
//                 renderTasks(uncompletedTasks);
//             })
//             .catch(error => {
//                 console.error('Error fetching uncompleted tasks:', error);
//             });
//     }

//     // Call the function when the page loads
//     loadTasks();
// });


document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch and render uncompleted tasks
    function loadTasks() {
        console.log(user_id)
        var url = `https://planner-plus-server-c35af645f504.herokuapp.com/api/tasks/pending/${user_id}`;
        console.log(url);

        // Make a GET request to the backend endpoint
        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Call a function to render the tasks immediately
                renderTasks(data.tasks);
            })
            .catch(error => {
                console.error('Error fetching uncompleted tasks:', error);
            });
    }

    // Call the function when the page loads
    loadTasks();
});

// Function to render tasks dynamically
function renderTasks(tasks) {
    const tasksWrapper = document.querySelector('.tasks-wrapper');

    tasks.forEach((task, index) => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'task';
        checkbox.id = `item-${index + 1}`;
        checkbox.className = 'task-item';
        checkbox.checked = task.completed;

        const label = document.createElement('label');
        label.setAttribute('for', `item-${index + 1}`);
        label.innerHTML = `<span class="label-text">${task.description}</span>`;

        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(label);

        tasksWrapper.appendChild(taskDiv);
    });
}
