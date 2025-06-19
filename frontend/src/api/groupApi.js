// frontend/src/api/groupApi.js

import apiClient from './apiClient';

/**
 * Fetches a list of all groups.
 */
export const apiGetGroups = async () => {
    try {
        const response = await apiClient.get('/groups/');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch groups:', error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Creates a new group.
 * @param {object} groupData - The data for the new group (e.g., { name: 'New Group', members: [...] }).
 */
export const apiCreateGroup = async (groupData) => {
    try {
        const response = await apiClient.post('/groups/', groupData);
        return response.data;
    } catch (error) {
        console.error('Failed to create group:', error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// ADDED: New function to get a single group by ID
/**
 * Fetches a single group by its ID.
 * @param {number} groupId - The ID of the group.
 */
export const apiGetGroup = async (groupId) => {
  try {
    const response = await apiClient.get(`/groups/${groupId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch group ${groupId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};