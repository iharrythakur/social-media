import axios from 'axios';
import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://social-media-4-0pb3.onrender.com';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  verifyToken: (data) => api.post('/api/auth/verify', data),
  getProfile: () => api.get('/api/auth/profile'),
};

// User API calls
export const userAPI = {
  getUser: (userId) => api.get(`/api/users/${userId}`),
  updateUser: (userId, data) => api.put(`/api/users/${userId}`, data),
  getCurrentUser: () => api.get('/api/users/me'),
  updateCurrentUser: (data) => api.put('/api/users/me', data),
};

// Posts API calls
export const postsAPI = {
  getPosts: (page = 1, limit = 20) => 
    api.get(`/api/posts?page=${page}&limit=${limit}`),
  createPost: (data) => api.post('/api/posts', data),
  getPost: (postId) => api.get(`/api/posts/${postId}`),
  likePost: (postId) => api.put(`/api/posts/${postId}/like`),
  getUserPosts: (userId, page = 1, limit = 20) => 
    api.get(`/api/posts/user/${userId}?page=${page}&limit=${limit}`),
};

// Health check
export const healthAPI = {
  check: () => api.get('/api/health'),
};

// Storage API calls
export const storageAPI = {
  uploadProfilePicture: async (file, firebase_uid) => {
    if (!file || !firebase_uid) {
      throw new Error('File and firebase_uid are required for upload.');
    }
    const filePath = `profile_pictures/${firebase_uid}/${file.name}`;
    const storageRef = ref(storage, filePath);
    
    // Upload file
    await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  }
};

export default api; 