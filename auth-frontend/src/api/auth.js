import axios from 'axios';

const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1/auth',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

function unwrapResponse(response) {
  return response.data;
}

function normalizeError(error) {
  const fallbackMessage = 'Something went wrong. Please try again.';
  return {
    message: error?.response?.data?.message || fallbackMessage,
    errorCode: error?.response?.data?.errorCode || 'UNKNOWN_ERROR',
  };
}

export async function sendOtp(payload) {
  try {
    const response = await authApi.post('/send-otp', payload);
    return unwrapResponse(response);
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function verifyOtp(payload) {
  try {
    const response = await authApi.post('/verify-otp', payload);
    return unwrapResponse(response);
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function registerUser(payload) {
  try {
    const response = await authApi.post('/register', payload);
    return unwrapResponse(response);
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function loginUser(payload) {
  try {
    const response = await authApi.post('/login', payload);
    return unwrapResponse(response);
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function getSession() {
  try {
    const response = await authApi.get('/session');
    return unwrapResponse(response);
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function logoutUser() {
  try {
    const response = await authApi.post('/logout');
    return unwrapResponse(response);
  } catch (error) {
    throw normalizeError(error);
  }
}
