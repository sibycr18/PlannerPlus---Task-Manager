This document provides instructions on how to configure and run the test suite for the Planner Plus Server.
## Configuration
### Prerequisites
- Python installed on your system.
- Pip package manager installed.
### Installation

Before running the test suite, ensure you have installed the required packages. If not, install them using the following command:

```bash
pip install requests
```


## Running the Tests
### Test Configuration

In the `test.py` file, the `BASE_URL` variable contains the address where the flask server is currently hosted. This is used to test the connection with the deployed server.

```python
BASE_URL = "https://planner-plus-server-c35af645f504.herokuapp.com/api"
```


### Running the Test Locally

To test the server locally, change the `BASE_URL` variable to your local server address:

```python
BASE_URL = "http://localhost:5000/api"
```


### Executing the Tests

To run the test, first navigate to the tests folder:
```bash
cd tests
```
Execute the following command to run the test file:
```bash
python test.py
```


## Test Cases
### `test_api()`

This function tests the `/api/test` endpoint to ensure the server connection is successful. It performs the following checks: 
- Sends a GET request to the `/api/test` endpoint.
- Validates the response status code is 200 (OK). 
- Validates the response JSON matches the expected message: `{"message": "Connection Successful"}`.

If the tests pass, the output will indicate that the connection is successfully established.
## Troubleshooting 
- If the tests fail, check the `BASE_URL` variable in the `test.py` file. Ensure it points to the correct server URL or the port mentioned is correct.
- Verify your internet connection if the tests are unable to reach the server.