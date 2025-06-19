// src/api/balancesApi.js
import apiClient from './apiClient';

/**
 * fetches the simplified balances for a specific group.
 * @param {string} groupName - the name of the group.
 */
export const apiGetGroupBalances = async (groupName) => {
  if (!groupName) return [];
  try {
    const response = await apiClient.get(`/balances/group/${groupName}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch balances for group ${groupName}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};