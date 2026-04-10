const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to create headers with auth token
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Helper function to handle API responses and auth errors
const handleResponse = async (response, errorMessage) => {
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    const error = await response.json();
    throw new Error(error.message || errorMessage);
  }
  return response.json();
};

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    return handleResponse(response, 'Login failed');
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    return handleResponse(response, 'Registration failed');
  }
};

// Students API
export const studentsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/students`, {
      headers: getAuthHeaders()
    });

    return handleResponse(response, 'Failed to fetch students');
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      headers: getAuthHeaders()
    });

    return handleResponse(response, 'Failed to fetch student');
  },

  create: async (studentData) => {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(studentData)
    });

    return handleResponse(response, 'Failed to create student');
  },

  update: async (id, studentData) => {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(studentData)
    });

    return handleResponse(response, 'Failed to update student');
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    return handleResponse(response, 'Failed to delete student');
  },

  predictPerformance: async (studentData) => {
    const response = await fetch(`${API_BASE_URL}/students/predict`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(studentData)
    });

    return handleResponse(response, 'Failed to predict performance');
  },

  predictBatchPerformance: async (studentsData) => {
    const response = await fetch(`${API_BASE_URL}/students/predict-batch`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ students: studentsData })
    });

    return handleResponse(response, 'Failed to predict batch performance');
  }
};