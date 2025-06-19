// src/api/usersApi.js
import apiClient from './apiClient';

/**
 * fetches the overall balance summary for a specific user.
 * @param {number} userId - the id of the user.
 */
export const apiGetUserBalances = async (userId) => {
  // a basic check to ensure we don't call the api with an empty id
  if (!userId) {
    throw new Error('User ID cannot be empty.');
  }
  try {
    const response = await apiClient.get(`/users/${userId}/balances`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch balances for user ${userId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};