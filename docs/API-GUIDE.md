# Planner<sup>+</sup> API Reference Guide

## 1. Test API
### Endpoint: `/api/test`
#### GET

Test the connection to the API.
#### Example

```bash
curl -X GET https://planner-plus-server.herokuapp.com/api/test
```


## 2. User Authentication

### 2.1 Register User

### Endpoint: `/api/users/register`

#### POST
Register a new user.

#### Parameters 
- `username` (string): User's username. 
- `password` (string): User's password.
- 
#### Example
```bash
curl -X POST -H "Content-Type: application/json" -d '{"username": "example", "password": "password"}' https://planner-plus-server.herokuapp.com/api/users/register
```


### 2.2 Login User

### Endpoint: `/api/users/login`

#### POST
Login a user.

#### Parameters 
- `username` (string): User's username. 
- `password` (string): User's password.
- 
#### Example
```bash
curl -X POST -H "Content-Type: application/json" -d '{"username": "example", "password": "password"}' https://planner-plus-server.herokuapp.com/api/users/login
```


### 2.3 Logout User

### Endpoint: `/api/users/logout`

#### GET
Logout a user and invalidate the session.

#### Example
```bash
curl -X GET https://planner-plus-server.herokuapp.com/api/users/logout
```

## 3. Task Management

### 3.1 Add a Task

### Endpoint: `/api/tasks/add`

#### POST
Add a new task.

#### Parameters 
- `user_id` (string): User's ID. 
- `task_desc` (string): Task description. 
- `tags` (array): List of tags. 
- `due` (string): Due date and time (Format: `YYYY-mm-ddTHH:MM:ss`).
- 
#### Example
```bash
curl -X POST -H "Content-Type: application/json" -d '{"user_id": "example_id", "task_desc": "Example Task", "tags": ["work", "urgent"], "due": "2023-12-31T18:00:00"}' https://planner-plus-server.herokuapp.com/api/tasks/add
```

### 3.2 Delete a Task

### Endpoint: `/api/tasks/delete`

#### DELETE
Delete a task.

#### Parameters 
- `user_id` (string): User's ID. 
- `task_id` (string): Task ID.
- 
#### Example
```bash
curl -X DELETE -H "Content-Type: application/json" -d '{"user_id": "example_id", "task_id": "example_task_id"}' https://planner-plus-server.herokuapp.com/api/tasks/delete
```

### 3.3 Get Upcoming Tasks

### Endpoint: `/api/tasks/pending/<user_id>`

#### GET
Get a list of upcoming tasks.

#### Parameters 
- `user_id` (string): User's ID.
- 
#### Example
```bash
curl -X GET https://planner-plus-server.herokuapp.com/api/tasks/pending/example_id
```

### 3.4 Get Completed Tasks

### Endpoint: `/api/tasks/completed/<user_id>`

#### GET
Get a list of completed tasks.

#### Parameters 
- `user_id` (string): User's ID.
- 
#### Example
```bash
curl -X GET https://planner-plus-server.herokuapp.com/api/tasks/completed/example_id
```

### 3.5 Mark Task as Complete

### Endpoint: `/api/tasks/mark/complete`

#### POST
Mark a task as complete.

#### Parameters 
- `user_id` (string): User's ID. 
- `task_id` (string): Task ID.
- 
#### Example
```bash
curl -X POST -H "Content-Type: application/json" -d '{"user_id": "example_id", "task_id": "example_task_id"}' https://planner-plus-server.herokuapp.com/api/tasks/mark/complete
```

### 3.6 Mark Task as Incomplete

### Endpoint: `/api/tasks/mark/incomplete`

#### POST
Mark a task as incomplete.

#### Parameters 
- `user_id` (string): User's ID. 
- `task_id` (string): Task ID.
- 
#### Example
```bash
curl -X POST -H "Content-Type: application/json" -d '{"user_id": "example_id", "task_id": "example_task_id"}' https://planner-plus-server.herokuapp.com/api/tasks/mark/incomplete
```
