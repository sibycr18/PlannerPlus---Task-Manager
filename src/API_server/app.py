from flask import Flask, request, Response, session
from flask_session import Session
from pymongo import MongoClient
from bson import json_util, ObjectId
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import datetime
import os

app = Flask(__name__)

CORS(app)  # Enable CORS for all routes
# TODO CORS(app, origins=["https://example.com", "https://another-example.com"])


# Configure Flask-Session
app.config['SESSION_TYPE'] = 'filesystem'  # You can use other session types as per your requirement
# generate a random secret key with os.urandom(24)
app.config['SECRET_KEY'] = os.urandom(24)
Session(app)


# TODO Enable HTTPS by providing SSL/TLS certificate and key files
# ssl_context = ('path/to/ssl_certificate.crt', 'path/to/ssl_private_key.key')
# Session(app, session_options={'session_type': 'filesystem'}, permanent=False, ssl_context=ssl_context)

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
    return {"message" : "Connection Successful"}


## User Authentication Endpoints
## =========================================================================================================

# Register User
@app.route('/api/users/register', methods=['POST'])
def register_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if users_collection.find_one({'username': username}) == None:
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        user_id = users_collection.insert_one({'username': username, 'password': hashed_password}).inserted_id
        response_data = {'message': 'User registered successfully', 'user_id': str(user_id)}
        return Response(json_util.dumps(response_data, indent=2), content_type='application/json'), 201
    response_data = {'message': 'Username already exists'}
    return Response(json_util.dumps(response_data, indent=2), content_type='application/json'), 409

# User Login
@app.route('/api/users/login', methods=['POST'])
def login_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = users_collection.find_one({'username': username})
    if user and bcrypt.check_password_hash(user['password'], password):
        session['user_id'] = str(user['_id'])  # Set user ID in session
        response_data = {'message': 'Login successful'}
        return Response(json_util.dumps(response_data, indent=2), content_type='application/json'), 200
    else:
        response_data = {'message': 'Invalid credentials'}
        return Response(json_util.dumps(response_data, indent=2), content_type='application/json'), 401


# User Logout (Token Invalidation)
@app.route('/api/users/logout', methods=['GET'])
def logout_user():
    session.clear()  # Clear session data
    response_data = {'message': 'User logged out successfully'}
    return Response(json_util.dumps(response_data, indent=2), content_type='application/json'), 200




## Task Management Endpoints
## =========================================================================================================

# Add a Task
@app.route('/api/tasks/add', methods=['POST'])
def add_task():
    data = request.get_json()
    user_id = data.get('user_id')
    completed = False
    task_desc = data.get('task_desc')
    due = data.get('due')  # Format: <YYYY-mm-ddTHH:MM:ss>
    tags = data.get('tags', [])  # List of tags
    task_data = {
        '_id': ObjectId(),
        'user_id': ObjectId(user_id),
        'task_desc': task_desc,
        'completed': completed,
        'due': datetime.strptime(due, f'%Y-%m-%dT%H:%M:%S%z'),
        'tags': tags
    }
    result = tasks_collection.insert_one(task_data)
    if result.inserted_id:
        response_data = {'message': 'Task added successfully', 'task_id': str(task_data['_id'])}
        return Response(json_util.dumps(response_data, indent=2), content_type='application/json'), 201
    else:
        response_data = {'message': 'User not found or task could not be added'}
        return Response(json_util.dumps(response_data, indent=2), content_type='application/json'), 404

# Delete a Task
@app.route('/api/tasks/delete', methods=['DELETE'])
def delete_task():
    data = request.get_json()
    task_id = data.get('task_id')
    user_id = data.get('user_id')
    result = tasks_collection.delete_one({'_id': ObjectId(task_id), 'user_id': ObjectId(user_id)})
    if result.deleted_count > 0:
        response_data = {'message': 'Task deleted successfully'}
        return Response(json_util.dumps(response_data, indent=2), content_type='application/json'), 200
    else:
        response_data = {'message': 'Task not found or user not authorized'}
        return Response(json_util.dumps(response_data, indent=2), content_type='application/json'), 404

# Get Upcoming Tasks
@app.route('/api/tasks/pending/<user_id>', methods=['GET'])
def get_upcoming_tasks(user_id):
    upcoming_tasks = list(tasks_collection.find({'user_id': ObjectId(user_id), 'completed': False}))
    response_data = {'tasks': upcoming_tasks}
    return Response(json_util.dumps(response_data, indent=2), content_type='application/json'), 200

# Get Completed Tasks
@app.route('/api/tasks/completed/<user_id>', methods=['GET'])
def get_completed_tasks(user_id):
    completed_tasks = list(tasks_collection.find({'user_id': ObjectId(user_id), 'completed': True}))
    response_data = {'tasks': completed_tasks}
    return Response(json_util.dumps(response_data, indent=2), content_type='application/json'), 200

# Mark Task as Complete
@app.route('/api/tasks/mark/complete', methods=['POST'])
def mark_task_complete():
    data = request.get_json()
    task_id = data.get('task_id')
    user_id = data.get('user_id')
    result = tasks_collection.update_one(
        {'user_id': ObjectId(user_id), '_id': ObjectId(task_id)},
        {'$set': {'completed': True}}
    )
    if result.modified_count > 0:
        response_data = {'message': 'Task marked as complete successfully'}
        return Response(json_util.dumps(response_data, indent=2), content_type='application/json'), 200
    else:
        response_data = {'message': 'Task not found or user not authorized'}
        return Response(json_util.dumps(response_data, indent=2), content_type='application/json'), 404

# Mark Task as Incomplete
@app.route('/api/tasks/mark/incomplete', methods=['POST'])
def mark_task_incomplete():
    data = request.get_json()
    task_id = data.get('task_id')
    user_id = data.get('user_id')
    result = tasks_collection.update_one(
        {'user_id': ObjectId(user_id), '_id': ObjectId(task_id)},
        {'$set': {'completed': False}}
    )
    if result.modified_count > 0:
        response_data = {'message': 'Task marked as incomplete successfully'}
        return Response(json_util.dumps(response_data, indent=2), content_type='application/json'), 200
    else:
        response_data = {'message': 'Task not found or user not authorized'}
        return Response(json_util.dumps(response_data, indent=2), content_type='application/json'), 404


# Run Flask App
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5050)
