import { axiosInstance } from ".";

const handleResponse = async (request) => {
  try {
    const response = await request;
    return response.data;
  } catch (err) {
    return err.response;
  }
};

export const makePayment = (token, amount) => {
  return handleResponse(
    axiosInstance.post('/api/bookings/make-payment', { token, amount })
  );
};

export const bookShow = (payload) => {
  return handleResponse(
    axiosInstance.post('/api/bookings/book-show', payload)
  );
};

export const getAllBookings = () => {
  return handleResponse(
    axiosInstance.get('/api/bookings/get-all-bookings')
  );
};
