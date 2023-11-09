import requests

# To test the local server
# BASE_URL = "http://localhost:5050/api"

# To test the server deployed on Heroku
BASE_URL = "https://planner-plus-server-c35af645f504.herokuapp.com/api"

# Test /api/test endpoint

def test_api():
    """
    Function to test the API connection.
    """

    # Make GET request to the test endpoint
    response = requests.get(f"{BASE_URL}/test")

    # Check if the response status code is 200
    assert response.status_code == 200

    # Check if the response JSON is equal to the expected message
    assert response.json() == {"message": "Connection Successful"}

    # Print success message if the tests pass
    print("Test passed! Connection is successfully established.")

# Run Test
if __name__ == "__main__":
    test_api()
