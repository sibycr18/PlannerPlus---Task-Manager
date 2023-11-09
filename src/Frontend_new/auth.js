// LOGIN PAGE
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
                // If login is successful, redirect to the dashboard page
                window.location.href = 'dashboard.html'; // Replace 'dashboard.html' with the actual path to your dashboard page
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

// REGISTER PAGE
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
