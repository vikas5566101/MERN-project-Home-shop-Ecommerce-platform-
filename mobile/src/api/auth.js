import apiClient from './apiClient';

export const loginAPI = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

export const registerAPI = async (name, email, password) => {
  const response = await apiClient.post('/auth/register', { name, email, password });
  return response.data;
};

export const verifyOtpAPI = async (email, otp) => {
  const response = await apiClient.post('/auth/verify-otp', { email, otp });
  return response.data;
};
