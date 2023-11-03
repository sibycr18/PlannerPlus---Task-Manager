from flask import Flask, request, Response
from pymongo import MongoClient
from bson import json_util, ObjectId

app = Flask(__name__)

connection_string = "mongodb://localhost:27017"
client = MongoClient(connection_string)


users_collection = client.PlannerPlus.Users
tasks_collection = client.PlannerPlus.Tasks

# Test API Endpoint
@app.route('/api/test', methods=['GET'])
def test_api():
    return {"status" : "connected"}