

import apiClient from './apiClient';

/**
 * Posts a new expense to a specific group.
 * @param {object} params - The parameters.
 * @param {number} params.groupId - The ID of the group.
 * @param {object} params.expenseData - The data for the new expense.
 */
export const apiAddExpenseToGroup = async ({ groupId, expenseData }) => {
  try {
    
    const response = await apiClient.post(`/groups/${groupId}/expenses/`, expenseData);
    return response.data;
  } catch (error) {
    console.error(`Failed to add expense to group ${groupId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};