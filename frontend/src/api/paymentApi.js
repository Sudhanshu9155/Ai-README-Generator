import api from './axios';

export const createOrder = async () => {
    const response = await api.post('/payment/order');
    return response.data;
};

export const verifyPayment = async (paymentData) => {
    const response = await api.post('/payment/verify', paymentData);
    return response.data;
};
