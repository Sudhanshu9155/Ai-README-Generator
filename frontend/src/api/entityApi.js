import api from './axios';

// Create a new README
export const createReadme = async (data) => {
    const response = await api.post('/entity', data);
    return response.data;
};

// Get all READMEs for the user
export const getUserReadmes = async () => {
    const response = await api.get('/entity');
    return response.data;
};

// Get a single README by ID
export const getReadmeById = async (id) => {
    const response = await api.get(`/entity/${id}`);
    return response.data;
};

// Update a README
export const updateReadme = async (id, data) => {
    const response = await api.put(`/entity/${id}`, data);
    return response.data;
};

// Delete a README
export const deleteReadme = async (id) => {
    const response = await api.delete(`/entity/${id}`);
    return response.data;
};
