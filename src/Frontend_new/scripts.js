// LOGIN PAGE
// Get the login button element by its ID
const loginButton = document.getElementById('login-button');

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
    fetch('https://example.com/api/login', {
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
            // If login fails, display an error message (you can customize this part)
            alert('Login failed. Please check your username and password.');
        }
    })
    .catch(error => {
        // Handle any errors that occurred during the fetch operation
        console.error('Error:', error);
    });
});


// REGISTER PAGE