# Student Management System - Backend

Express.js API backend for the Student Management System with MongoDB integration.

## Features

- **Authentication**: JWT-based user authentication
- **Student Management**: Full CRUD operations for student records
- **Data Validation**: Input validation using express-validator
- **Security**: Password hashing with bcryptjs
- **Database**: MongoDB with Mongoose ODM

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: bcryptjs for password hashing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/studentmanagement
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   ```

4. **Start MongoDB:**
   Make sure MongoDB is running on your system.

5. **Seed the database with admin user:**
   ```bash
   npm run seed
   ```

6. **Start the server:**
   ```bash
   npm run dev  # For development (with nodemon)
   # or
   npm start    # For production
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

#### POST /api/auth/login
Login with username and password.

**Request Body:**
```json
{
  "username": "admin",
  "password": "password"
}
```

**Response:**
```json
{
  "token": "jwt_token_here"
}
```

#### POST /api/auth/register
Register a new user (for demo purposes).

### Students

All student endpoints require authentication (Bearer token in Authorization header).

#### GET /api/students
Get all students.

**Response:**
```json
[
  {
    "_id": "student_id",
    "name": "John Doe",
    "email": "john@example.com",
    "age": 20,
    "grade": "A",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### GET /api/students/:id
Get a specific student by ID.

#### POST /api/students
Create a new student.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 20,
  "grade": "A"
}
```

#### PUT /api/students/:id
Update a student.

**Request Body:** (same as POST, only include fields to update)

#### DELETE /api/students/:id
Delete a student.

## Data Models

### User
```javascript
{
  username: String (required, unique, 3-20 chars),
  password: String (required, hashed, min 6 chars),
  timestamps: true
}
```

### Student
```javascript
{
  name: String (required, max 50 chars),
  email: String (required, unique, valid email),
  age: Number (required, 1-100),
  grade: String (required, max 20 chars),
  timestamps: true
}
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Create default admin user

## Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `PORT` - Server port (default: 5000)

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Input validation and sanitization
- CORS enabled for frontend communication
- Protected routes with middleware

## Development

For development, the server auto-restarts on file changes when using `npm run dev`.

## Deployment

1. Set environment variables
2. Run `npm run seed` to create admin user
3. Run `npm start` to start the server
4. Ensure MongoDB is accessible

## License

This project is part of the Student Management System.