// LOGIN PAGE ---------------------------------------------------------------------------------------
// Declare user_id globally
var user_id;

document.addEventListener('DOMContentLoaded', function() {
    // Get the login button element by its ID
    const loginButton = document.getElementById('login-button');
    const errorMessage = document.getElementById('login-error-message');

    // Add click event listener to the login button
    loginButton.addEventListener('click', function(event) {
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
                window.location.href = '../../Frontend/dashboard/dashboard.html'; // Replace 'dashboard.html' with the actual path to your dashboard page
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
document.addEventListener('DOMContentLoaded', function() {
    const registerButton = document.getElementById('register-button');
    const errorMessage = document.getElementById('register-error');
    const errorMessageText = document.getElementById('register-error-message');

    registerButton.addEventListener('click', function(event) {
        event.preventDefault();

        // Get the username and password inputs for registration
        const username = document.querySelector('input[type="username"]').value;
        const password = document.querySelector('input[type="password"]').value;

        // Create an object with the user credentials
        const credentials = {
            username: username,
            password: password
        };

        // alert("Fetch called");
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
    function loadPendingTasks() {
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

    // Attach event listener to the Completed button
    const completedButton = document.getElementById('completed-button');
    completedButton.addEventListener('click', function() {
        // Load completed tasks when the Completed button is clicked
        loadCompletedTasks();
    });

    // Call the function to load pending tasks when the page loads
    loadPendingTasks();
});


// Function to remove all tasks from the HTML
function clearTasks() {
    const tasksContainer = document.getElementById('tasks-container');

    // Check if the container exists
    if (tasksContainer) {
        // Clear the content of the container
        tasksContainer.innerHTML = '';
    } else {
        console.error('Tasks container not found.');
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

        const label = document.createElement('label');
        label.setAttribute('for', `item-${index + 1}`);
        label.innerHTML = `<span class="label-text">${task.task_desc}</span>`;

        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(label);

        tasksWrapper.appendChild(taskDiv);
    });
}


// Logout button clicked
document.addEventListener('DOMContentLoaded', function() {
    // Get the logout button element by its ID
    const logoutButton = document.getElementById('logout-button');

    // Add click event listener to the logout button
    logoutButton.addEventListener('click', function(event) {
        // Prevent the default behavior of the button
        event.preventDefault();

        // Assuming you have the user_id stored globally or retrieved from storage
        var user_id = '...'; // Replace with the actual user_id

        // Make a GET request to the server logout endpoint
        fetch(`https://planner-plus-server-c35af645f504.herokuapp.com/api/users/logout`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            // Assuming the server returns a success message
            if (data.success) {
                // Redirect to the login page after logout
                window.location.href = '../../Frontend/authorization/login.html'; // Update with the actual path to your login page
            } else {
                // Handle logout failure, display an error message, etc.
                console.error('Logout failed:', data.message);
            }
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch operation
            console.error('Error:', error);
        });
    });
});
