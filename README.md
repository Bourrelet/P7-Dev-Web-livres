# Book Management REST API (Node.js / Express / MongoDB)

Handmade Backend project by Eva ; project built from scratch by me and myself, featuring a Node.js REST API built with Express, connected to a MongoDB database using Mongoose. 
This API manages CRUD operations for "Books" and "Users," including image uploads with resizing using Sharp, as well as secure user authentication and registration.

## Objectives
- Create a backend server with Node.js and Express.
- Connect to MongoDB and manage data with Mongoose.
- Implement RESTful CRUD operations.
- Handle image uploads, resizing, and caching.
- Implement secure user authentication and registration.

## My Contribution
- Developed a Node.js server using Express.js.
- Designed and implemented the MongoDB database structure using Mongoose.
- Implemented routes, controllers, and middleware to handle CRUD requests from the frontend.
- Created Mongoose schemas/models for Books and Users.
- Managed image uploads, resizing with Sharp, and caching.
- Implemented user registration and authentication middleware using bcrypt for password hashing and JSON Web Tokens (JWT) for secure sessions.
- Built custom error-handling middleware to manage exceptions and errors with proper business logic.
- Secured sensitive configuration data using dotenv for environment variables.

## Technologies Used
- Node.js
- Express
- MongoDB
- Mongoose
- Sharp (for image processing)
- Multer (for handling multipart/form-data)
- bcrypt (for password hashing)
- JSON Web Tokens (JWT)
- dotenv (for managing environment variables)

## Features
- Full CRUD operations (Create, Read, Update, Delete) for Books.
- Secure user registration, authentication, and authorization using JWT.
- Image upload with automatic resizing, optimization, and caching.
- Custom middleware for authentication and error handling.

## What I Learned
- Building a RESTful API from scratch using Node.js and Express.
- Structuring a backend with routes, controllers, and middleware.
- Designing and building a MongoDB database structure from scratch.
- Implementing secure user registration and authentication middleware using bcrypt and JWT.
- Handling errors and exceptions using Express middleware, including error bubbling and proper error management strategies.
- Managing file uploads and image processing with Multer and Sharp.
- Securing environment variables using dotenv.
- Implementing complex CRUD logic in a real-world scenario.
