
# How to Run the Flask API Server Locally

## Prerequisites 

1. **Python:**  Ensure that Python is installed on your machine. You can download it from [python.org](https://www.python.org/downloads/) . 

2. **MongoDB:**  Make sure you have the MongoDB connection string. You can email me at [sibycr18@gmail.com](mailto:sibycr18@gmail.com) for the PlannerPlus DB connection string or setup a MongoDB Atlas account of your own to setup your own db.
## Setup 
1. Clone the repository:
```bash
git clone https://github.com/sibycr18/PlannerPlus---Task-Manager/tree/master
cd src/API_server
``` 
2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Configure Environment Variables 
1. Create a `.env` file in the root of your project. 
2. Add the following variables to the `.env` file:

```env
CONNECTION_STRING=<your-mongodb-connection-string>
```

## Run the Flask Server 
1. Open a terminal in the project directory. 
2. Run the following command to start the Flask server:

```bash
python app.py
```

The server should start running on `http://127.0.0.1:5050/`.

## Test the API
You can test the API by using tools like [Postman](https://www.postman.com/)  or [Hoppscotch](https://hoppscotch.io/) . 
- Test the connection: Send a GET request to `http://127.0.0.1:5050/api/test` to ensure that the server is running. OR Head to `root/tests` folder for the automated api connection test.
- Register a new user, login, and test other endpoints as needed.

## Stop the Server
To stop the server, press `Ctrl + C` in the terminal where the server is running.
Now you have your Flask API server up and running locally!