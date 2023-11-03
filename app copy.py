from flask import Flask, request, Response
from pymongo import MongoClient
from bson import json_util, ObjectId
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import os

app = Flask(__name__)
bcrypt = Bcrypt(app)

# Load environment variables
load_dotenv()

# Load connection string from env variable
CONNECTION_STRING = os.getenv("CONNECTION_STRING")

# Establish connection with MongoDB Atlas
client = MongoClient(CONNECTION_STRING)
users_collection = client.PlannerPlus.Users
tasks_collection = client.PlannerPlus.Tasks


# Test API Endpoint
@app.route('/api/test', methods=['GET'])
def test_api():
    return {"status" : "connected"}


## User Authentication Endpoints
## =========================================================================================================

# Register User
@app.route('/api/users/register', methods=['POST'])
def register_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user_id = users_collection.insert_one({'username': username, 'password': hashed_password}).inserted_id
    response_data = {'message': 'User registered successfully', 'user_id': str(user_id)}
    return Response(json_util.dumps(response_data), content_type='application/json'), 201

# User Login
@app.route('/api/users/login', methods=['POST'])
def login_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = users_collection.find_one({'username': username})
    if user and bcrypt.check_password_hash(user['password'], password):
        # Generate authentication token (implement your own token generation logic)
        token = 'generate_your_own_token_here'
        response_data = {'message': 'Login successful', 'token': token}
        return Response(json_util.dumps(response_data), content_type='application/json'), 200
    else:
        response_data = {'message': 'Invalid credentials'}
        return Response(json_util.dumps(response_data), content_type='application/json'), 401

# User Logout (Token Invalidation)
@app.route('/api/users/logout', methods=['GET'])
def logout_user():
    # Implement token invalidation logic here (if using tokens)
    response_data = {'message': 'User logged out successfully'}
    return Response(json_util.dumps(response_data), content_type='application/json'), 200



## Task Management Endpoints
## =========================================================================================================

# Create Task
@app.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    due_date = data.get('due_date')
    user_id = data.get('user_id')
    task_id = tasks_collection.insert_one({'title': title, 'description': description, 'due_date': due_date, 'user_id': user_id}).inserted_id
    response_data = {'message': 'Task created successfully', 'task_id': str(task_id)}
    return Response(json_util.dumps(response_data), content_type='application/json'), 201

# Get Tasks for a User
@app.route('/api/tasks/<user_id>', methods=['GET'])
def get_user_tasks(user_id):
    tasks = list(tasks_collection.find({'user_id': user_id}))
    response_data = {'tasks': tasks}
    return Response(json_util.dumps(response_data), content_type='application/json'), 200

# Update Task
@app.route('/api/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.get_json()
    edited_title = data.get('title')
    edited_description = data.get('description')
    edited_due_date = data.get('due_date')
    user_id = data.get('user_id')
    tasks_collection.update_one({'_id': ObjectId(task_id), 'user_id': user_id}, {'$set': {'title': edited_title, 'description': edited_description, 'due_date': edited_due_date}})
    response_data = {'message': 'Task updated successfully'}
    return Response(json_util.dumps(response_data), content_type='application/json'), 200


# Run Flask App
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)