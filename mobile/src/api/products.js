import apiClient from './apiClient';

export const getProducts = async () => {
  const response = await apiClient.get('/products');
  return response.data;
};
