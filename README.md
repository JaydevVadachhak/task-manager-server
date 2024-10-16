# rest-api
This project was generated with node version 16.14.2.

## Prerequisites
1. node - 16.14.2
2. mongodb - 5.0.4

## Running Development Server

Run `npm install`
Run `npm start`

## REST api
    - http://localhost:3000/api/users (POST - Create User)
        request = {
            "name": "Rahul Solanki",
            "email": "rahul@gmail.com",
            "password": "rahul@123",
            "age": 32
        }

    - http://localhost:3000/api/users/login (POST - Login User)
        request = {
            "email": "rahul5@gmail.com",
            "password": "rahul@123"
        }

    - http://localhost:3000/api/logout (POST - Logout User)
        request = {}

    - http://localhost:3000/api/users/me (GET - Get User Info)

    - http://localhost:3000/api/users/me (PATCH - Update User Info)
        request = {
            "name": "Rahul Solanki",
            "age": 32
        }

    - http://localhost:3000/api/users/me (DELETE - Delete User)

    - http://localhost:3000/api/tasks (POST - Create Task)
        request = {
            "description": "Upload Certificate",
            "completed": false
        }

    - http://localhost:3000/api/tasks (GET - Get All Tasks)

    - http://localhost:3000/api/tasks/:id (GET - Get Single Task)

    - http://localhost:3000/api/tasks/:id (PATCH - Update Task)
        request = {
            "description": "Upload Certificate",
            "completed": false
        }

    - http://localhost:3000/api/tasks/:id (DELETE - Delete Task)

## Further Help
Contact author <rahul.solanki@growexx.com>
