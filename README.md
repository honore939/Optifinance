# Student Management System

A full-stack React + Node.js application with MongoDB for comprehensive student record management.

## 🚀 Features

### Frontend (React)
- **Authentication**: Secure login system with JWT tokens
- **Dashboard**: Welcome page with navigation cards
- **Student Management**: Register, view, update, and delete student records
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with animations

### Backend (Node.js/Express)
- **RESTful API**: Complete API for student and user management
- **Authentication**: JWT-based secure authentication
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Input validation and error handling
- **Security**: Password hashing and protected routes

## 🛠 Technology Stack

### Frontend
- **React 19** - UI framework
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **CSS** - Modern styling with responsive design

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🚀 Getting Started

### 1. Clone and Install

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Setup Environment

Create `.env` file in `backend/` directory:
```env
MONGODB_URI=mongodb://localhost:27017/studentmanagement
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```

### 3. Start MongoDB

Make sure MongoDB is running on your system.

### 4. Seed Database

```bash
cd backend
npm run seed
```

This creates a default admin user:
- **Username:** admin
- **Password:** password

### 5. Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
App runs on `http://localhost:5177`

## 📱 Usage

1. **Open** `http://localhost:5177` in your browser
2. **Login** with credentials: `admin` / `password`
3. **Navigate** using the dashboard cards
4. **Manage Students**:
   - Register new students
   - View all student records
   - Edit student information inline
   - Delete students with confirmation

## 🏗 Project Structure

```
studentmanagemant/
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── api.js             # API service functions
│   ├── App.jsx            # Main app component
│   └── App.css            # Application styles
├── backend/               # Backend Node.js API
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── server.js          # Express server
│   └── README.md          # Backend documentation
├── public/                # Static assets
└── package.json           # Frontend dependencies
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Students (Protected)
- `GET /api/students` - Get all students
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

## 🎨 Features Overview

### Authentication System
- JWT token-based authentication
- Automatic logout on token expiry
- Secure API endpoints

### Student Management
- **Create**: Add new students with validation
- **Read**: View all students in responsive table
- **Update**: Inline editing in the table
- **Delete**: Remove students with confirmation

### User Experience
- Loading states and error handling
- Responsive design for all devices
- Intuitive navigation
- Form validation and feedback

## 🔧 Development Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start with nodemon (auto-restart)
- `npm start` - Start production server
- `npm run seed` - Create default admin user

## 🚀 Deployment

### Frontend
```bash
npm run build
```
Deploy the `dist/` folder to your web server.

### Backend
1. Set environment variables
2. Run `npm run seed` for initial user
3. Run `npm start`
4. Ensure MongoDB connection

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- CORS configuration
- Protected API routes

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full feature set
- **Tablet**: Adapted layouts
- **Mobile**: Touch-friendly interface

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

## 📄 License

This project is a demonstration of full-stack development with React and Node.js.
