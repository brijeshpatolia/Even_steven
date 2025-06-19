
import apiClient from './apiClient';


export const apiGetGroups = async () => {
  try {
    
    const response = await apiClient.get('/groups/');
    return response.data;
  } catch (error) {
    
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
    
    const response = await apiClient.post('/groups/', groupData);
    return response.data;
  } catch (error){
    
    console.error("Failed to create group:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};