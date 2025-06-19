// src/api/groupsApi.js
import apiClient from './apiClient';

/**
 * fetches all groups from the backend using axios.
 */
export const apiGetGroups = async () => {
  try {
    // cleaner: no full url, no manual json parsing
    const response = await apiClient.get('/groups/');
    return response.data;
  } catch (error) {
    // axios provides better error details
    console.error("Failed to fetch groups:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

/**
 * posts a new group to the backend using axios.
 * @param {object} groupData - the data for the new group (name, users).
 */
export const apiCreateGroup = async (groupData) => {
  try {
    // cleaner: no manual stringify, no headers, no manual json parsing
    const response = await apiClient.post('/groups/', groupData);
    return response.data;
  } catch (error){
    // cleaner error handling
    console.error("Failed to create group:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};