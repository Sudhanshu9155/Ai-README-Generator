import api from './axios';

export const chatWithAI = async (messages) => {
    const response = await api.post('/ai/chat', { messages });
    return response.data;
};
