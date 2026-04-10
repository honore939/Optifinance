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
  const contentType = response.headers.get('Content-Type') || '';
  const bodyText = await response.text();

  const parseJson = (text) => {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  };

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }

    const errorData = contentType.includes('application/json') ? parseJson(bodyText) : null;
    const message = errorData?.message || bodyText || errorMessage;
    throw new Error(message || errorMessage);
  }

  if (contentType.includes('application/json')) {
    return parseJson(bodyText);
  }

  return bodyText;
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

  savePrediction: async (predictionData) => {
    const response = await fetch(`${API_BASE_URL}/predictions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(predictionData)
    });

    return handleResponse(response, 'Failed to save prediction');
  },

  getPredictions: async () => {
    const response = await fetch(`${API_BASE_URL}/predictions`, {
      headers: getAuthHeaders()
    });

    return handleResponse(response, 'Failed to load predictions');
  },

  getPredictionReport: async () => {
    const response = await fetch(`${API_BASE_URL}/predictions/report`, {
      headers: getAuthHeaders()
    });

    return handleResponse(response, 'Failed to load prediction report');
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

export const marksAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/marks`, {
      headers: getAuthHeaders()
    });

    return handleResponse(response, 'Failed to fetch marks');
  },

  create: async (markData) => {
    const response = await fetch(`${API_BASE_URL}/marks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(markData)
    });

    return handleResponse(response, 'Failed to save mark');
  },

  update: async (id, markData) => {
    const response = await fetch(`${API_BASE_URL}/marks/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(markData)
    });

    return handleResponse(response, 'Failed to update mark');
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/marks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    return handleResponse(response, 'Failed to delete mark');
  },

  getByStudent: async (studentId) => {
    const response = await fetch(`${API_BASE_URL}/marks/student/${studentId}`, {
      headers: getAuthHeaders()
    });

    return handleResponse(response, 'Failed to fetch student marks');
  }
};
