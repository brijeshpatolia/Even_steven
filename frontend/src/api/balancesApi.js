
import apiClient from './apiClient';

/**
 * Fetches the simplified balances for a specific group.
 * @param {number} groupId - The ID of the group.
 */
export const apiGetGroupBalances = async (groupId) => {
  if (!groupId) return [];
  try {
    // UPDATED: URL now uses the groupId
    const response = await apiClient.get(`/balances/group/${groupId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch balances for group ${groupId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};