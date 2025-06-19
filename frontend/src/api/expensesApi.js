// src/api/expensesApi.js
import apiClient from './apiClient';

/**
 * posts a new expense to a specific group.
 * @param {string} groupName - the name of the group.
 * @param {object} expenseData - the data for the new expense.
 */
export const apiAddExpenseToGroup = async ({ groupName, expenseData }) => {
  try {
    const response = await apiClient.post(`/groups/${groupName}/expenses/`, expenseData);
    return response.data;
  } catch (error) {
    console.error(`Failed to add expense to group ${groupName}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};