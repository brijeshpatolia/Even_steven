import apiClient from './apiClient';

/**
 * Sends a query to the chatbot backend and returns the response.
 * @param {string} query The natural language query from the user.
 * @returns {Promise<object>} A promise that resolves to the server's response.
 */
export const apiChatbotQuery = async (query) => {
  try {
    // We send the query in the format the backend expects: { "query": "user's question" }
    const response = await apiClient.post('/chatbot/', { query });
    return response.data;
  } catch (error) {
    // Log the error and re-throw it so react-query can handle it
    console.error("Failed to get chatbot response:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};