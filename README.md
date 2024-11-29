# Server Project

## Description

This Server Project is built to manage users and courses, including functionalities such as registration, login, user information management, and course management. The project uses Node.js and MongoDB.

## Features

### User Management

- **User Registration**: Allows users to create a new account with name, email, and password. The password is encrypted before being stored in the database.
- **Login**: Allows users to log in using their email and password. Returns an access token if login is successful.
- **Update User Information**: Users can update their personal information such as name, email, phone number, and avatar.
- **Delete User**: Allows users to delete their accounts.

### Course Management

- **Create Course**: Allows users to create a new course with a title, description, content, and image.
- **Get All Courses**: Queries a list of all courses in the database.
- **Get Course by Link**: Searches for a course based on the created link.
- **Update Course Information**: Updates the information of an existing course.
- **Delete Course**: Removes a course from the database.

### Password Reset Management

- **Send Verification Code**: Sends a verification code to the user's email for password reset.
- **Validate Verification Code**: Validates the verification code to allow the user to reset their password.
- **Update Password**: Allows users to update their password after validation.

## Technologies Used

- **Node.js**: JavaScript platform for building server applications.
- **Express.js**: Framework for Node.js to build APIs.
- **Mongoose**: Library for interacting with MongoDB.
- **Cloudinary**: Image storage and management service.
- **Bcrypt**: Library for hashing passwords.
- **Jsonwebtoken**: Library for creating and validating tokens.

## Installation Guide

1. **Clone the repository**:
   git clone https://github.com/username/repository.git
   cd repository
   
Install required packages:
npm install

Configure environment variables: Create a .env file and add the following variables:
SECRET_KEY=your_secret_key

Run the server:
npm start

Contact
If you have any questions, please contact me at email@example.com.