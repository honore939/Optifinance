# Optifinance - Student Management System

A full-stack web application for managing student records with authentication and CRUD operations.

## Project Structure

This is a monorepo with separate frontend and backend:

- `backend/` - Express.js API server
- `frontend/` - React application with Vite

## Features

- **Authentication**: JWT-based login system
- **Student Management**: Register, view, update, and delete student records
- **Responsive UI**: Modern React interface
- **API Security**: Protected endpoints with token authentication
- **Data Validation**: Server-side input validation

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: bcryptjs for password hashing

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router
- **Styling**: CSS Modules

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd optifinance
   ```

2. **Install root dependencies:**
   ```bash
   npm install
   ```

3. **Setup Backend:**
   ```bash
   cd backend
   npm install
   ```
   Create `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/optifinance
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   ```

4. **Setup Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Seed Database (optional):**
   ```bash
   cd ../backend
   npm run seed
   ```
   Creates admin user: username `admin`, password `password`

### Running the Application

**Development Mode (both frontend and backend):**
```bash
npm run dev
```

**Run Backend Only:**
```bash
npm run dev:backend
```

**Run Frontend Only:**
```bash
npm run dev:frontend
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Build for Production

```bash
npm run build:frontend
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Students (Protected)
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

## Usage

1. Start the backend server
2. Start the frontend development server
3. Open http://localhost:5173 in your browser
4. Login with admin credentials
5. Manage student records through the interface

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
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