// LOGIN PAGE ---------------------------------------------------------------------------------------
// Declare user_id globally
var user_id;

document.addEventListener('DOMContentLoaded', function () {
    // Get the login button element by its ID
    const loginButton = document.getElementById('login-button');
    const errorMessage = document.getElementById('login-error-message');

    // Add click event listener to the login button
    loginButton.addEventListener('click', function (event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Get the username and password inputs
        const username = document.querySelector('input[type="username"]').value;
        const password = document.querySelector('input[type="password"]').value;

        // Create an object with the user credentials
        const credentials = {
            username: username,
            password: password
        };

        // Make an API request to the backend server
        fetch('https://planner-plus-server-c35af645f504.herokuapp.com/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        })
            .then(response => response.json())
            .then(data => {
                // Check the API response and redirect accordingly
                if (data.success) {
                    // Set user_id in local storage
                    localStorage.setItem('user_id', data.user_id);
                    // Redirect to the dashboard page
                    window.location.href = 'index.html'; // Replace 'dashboard.html' with the actual path to your dashboard page
                } else {
                    // If login fails, display an error message
                    errorMessage.textContent = 'Login failed. Please check your credentials!';
                }
            })
            .catch(error => {
                // Handle any errors that occurred during the fetch operation
                console.error('Error:', error);
            });
    });
});

// REGISTER PAGE --------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    const registerButton = document.getElementById('register-button');
    const errorMessage = document.getElementById('register-error');
    const errorMessageText = document.getElementById('register-error-message');

    registerButton.addEventListener('click', function (event) {
        event.preventDefault();

        // Get the username and password inputs for registration
        const username = document.querySelector('input[type="username"]').value;
        const password = document.querySelector('input[type="password"]').value;

        // Create an object with the user credentials
        const credentials = {
            username: username,
            password: password
        };

        // Make an API request to the backend server for registration
        fetch('https://planner-plus-server-c35af645f504.herokuapp.com/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // If registration is successful, redirect to the login page
                    alert('Registration successful! You can now log in now.');
                    window.location.href = 'login.html';
                } else {
                    // If registration fails, display an error message
                    errorMessageText.textContent = 'User already exists.';
                    errorMessage.style.display = "block";
                    // alert('User already exists.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                errorMessage.textContent = 'An error occurred during registration. Please try again later.';
            });
    });
});


// DASHBOARD PAGE --------------------------------------------------------------------------------------------


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


function checkUserIdAndRedirect() {
    // Check if user_id is null in localStorage
    const userId = localStorage.getItem('user_id');

    if (userId === null) {
        if (localStorage.getItem('user_id') != null) {
            logout() // Api call to logout to clear flask session
        }
        // Redirect to login.html
        window.location.href = 'login.html';
    }
}

// Call the function when needed, for example, when the page loads
// checkUserIdAndRedirect();

// Function to fetch and render uncompleted tasks
function loadPendingTasks() {
    checkUserIdAndRedirect();
    clearTasks()
    var url = `https://planner-plus-server-c35af645f504.herokuapp.com/api/tasks/pending/${localStorage.getItem('user_id')}`;

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

// Function to fetch and render completed tasks
function loadCompletedTasks() {
    checkUserIdAndRedirect();
    clearTasks()
    var url = `https://planner-plus-server-c35af645f504.herokuapp.com/api/tasks/completed/${localStorage.getItem('user_id')}`;

    // Make a GET request to the backend endpoint
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Call a function to render the tasks immediately
            renderTasks(data.tasks);
        })
        .catch(error => {
            console.error('Error fetching completed tasks:', error);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    // Attach event listener to the Completed button
    const completedButton = document.getElementById('completed-button');
    completedButton.addEventListener('click', function () {
        // Load completed tasks when the Completed button is clicked
        loadCompletedTasks();
    });

    // Attach event listener to the Pending button
    const pendingButton = document.getElementById('pending-button');
    pendingButton.addEventListener('click', function () {
        // Load completed tasks when the Completed button is clicked
        loadPendingTasks();
    });

    // Call the function to load pending tasks when the page loads
    loadPendingTasks();
});


// Function to remove all tasks from the HTML
function clearTasks() {
    const tasksContainer = document.querySelector('.tasks-wrapper');

    // Check if the container exists
    if (tasksContainer) {
        // Clear the content of the container
        tasksContainer.innerHTML = '';
    } else {
        console.error('Tasks container not found.');
    }
}

// Function to remove a task
function removeTask(taskId) {
    // Find the task element by task ID
    const taskToRemove = document.querySelector(`input[task_id="${taskId}"]`);

    // Check if the task element exists
    if (taskToRemove) {
        // Remove the task element's parent (the taskDiv)
        taskToRemove.parentNode.remove();
    } else {
        console.warn(`Task with ID ${taskId} not found.`);
    }
}

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
        checkbox.setAttribute('task_id', task._id); // Set the task_id attribute = task.task_id;
        // console.log("task_id attribute: " + checkbox.getAttribute('task_id'));

        const label = document.createElement('label');
        label.setAttribute('for', `item-${index + 1}`);
        label.innerHTML = `<span class="label-text">${task.task_desc}</span>`;

        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(label);
        tasksWrapper.appendChild(taskDiv);
    });
}


// Logout button clicked
document.addEventListener('DOMContentLoaded', function () {
    // Get the logout button element by its ID
    const logoutButton = document.getElementById('logout-button');

    // Add click event listener to the logout button
    logoutButton.addEventListener('click', function (event) {
        // Prevent the default behavior of the button
        event.preventDefault();
        logout()
    });
});

function logout() {
    // Make a GET request to the server logout endpoint
    fetch(`https://planner-plus-server-c35af645f504.herokuapp.com/api/users/logout`, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            // Assuming the server returns a success message
            if (data.success) {
                // Redirect to the login page after logout
                localStorage.clear()
                window.location.href = 'login.html'; // Update with the actual path to your login page
            } else {
                // Handle logout failure, display an error message, etc.
                console.error('Logout failed:', data.message);
            }
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch operation
            console.error('Error:', error);
        });
}

// Add task when button clicked
document.addEventListener('DOMContentLoaded', function () {
    const addTasksContainer = document.getElementById('addTaskWrapper');
    const addTaskButton = document.getElementById('add-task');

    addTaskButton.addEventListener('click', function () {
        // Create a new task input field
        const newTaskInput = document.createElement('input');
        newTaskInput.type = 'text';
        newTaskInput.placeholder = 'Enter task here...';

        // Create a "tick" button
        const tickButton = document.createElement('button');
        tickButton.classList.add('icon-button');
        tickButton.innerText = '';

        // Append the new input and button to the tasks container
        addTasksContainer.appendChild(newTaskInput);
        addTasksContainer.appendChild(tickButton);

        // Add event listener to the "tick" button
        tickButton.addEventListener('click', function () {
            // Get the text from the input field
            const taskText = newTaskInput.value;
            
            if (taskText !== '') {
                // Call a function to add the task using an API request
                addTask(taskText);
            }

            // Remove the input field and button after adding the task
            addTasksContainer.removeChild(newTaskInput);
            addTasksContainer.removeChild(tickButton);
        });
    });

    function addTask(taskText) {
        // Make an API request to add the task
        fetch('https://planner-plus-server-c35af645f504.herokuapp.com/api/tasks/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: localStorage.getItem('user_id'),
                task_desc: taskText,
            }),
        })
            .then(response => response.json())
            .then(data => {
                // Handle the API response, update UI, etc.
                console.log('Task added:', data);
                selector = '.action-list li';

                // Add 'active' class to the pending button and remove it from the completed button
                elems = document.querySelectorAll(selector);
                elems[0].classList.add('active');
                elems[1].classList.remove('active');

                loadPendingTasks()
            })
            .catch(error => {
                console.error('Error adding task:', error);
            });
    }
});


// Function to mark a task as complete
function markTaskAsComplete(task_id, user_id) {
    console.log("Task:" + JSON.stringify({
        task_id: task_id,
        user_id: user_id
    }))
    // Make a POST request to mark the task as complete
    fetch(`https://planner-plus-server-c35af645f504.herokuapp.com/api/tasks/mark/complete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            task_id: task_id,
            user_id: user_id
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Task marked as complete:', data);
                removeTask(task_id)
            }
        })
        .catch(error => {
            console.error('Error marking task as complete:', error);
        });
}

// Function to mark a task as incomplete
function markTaskAsIncomplete(task_id, user_id) {
    console.log("Task:" + JSON.stringify({
        task_id: task_id,
        user_id: user_id
    }))
    // Make a POST request to mark the task as complete
    fetch(`https://planner-plus-server-c35af645f504.herokuapp.com/api/tasks/mark/incomplete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            task_id: task_id,
            user_id: user_id
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Task marked as incomplete:', data);
                removeTask(task_id)
            }
        })
        .catch(error => {
            console.error('Error marking task as incomplete:', error);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    // Event listener for changes in task checkboxes
    document.addEventListener('change', function (event) {
        const checkbox = event.target;
        console.log("Checkbox clicked:" + checkbox.id)
        const taskId = checkbox.getAttribute('task_id'); // Extract the taskId from the checkbox's ID or other attributes;
        const userId = localStorage.getItem('user_id');
        // Check if the changed element is a task checkbox
        if (checkbox.type === 'checkbox' && checkbox.classList.contains('task-item')) {
            if (checkbox.checked) {
                // Call the function to mark the task as complete
                markTaskAsComplete(taskId, userId);
            } else {
                // Call the function to mark the task as incomplete
                markTaskAsIncomplete(taskId, userId);
            }
        }
    });
});