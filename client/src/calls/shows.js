import { axiosInstance } from "./index";

const handleResponse = async (request) => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response || error.message;
  }
};

export const addShow = (payload) => {
  return handleResponse(
    axiosInstance.post('/api/shows/add-show', payload)
  );
};

export const updateShow = (payload) => {
  return handleResponse(
    axiosInstance.put('/api/shows/update-show', payload)
  );
};

export const getShowsByTheatre = (payload) => {
  return handleResponse(
    axiosInstance.post('/api/shows/get-all-shows-by-theatre', payload)
  );
};

export const deleteShow = (payload) => {
  return handleResponse(
    axiosInstance.post('/api/shows/delete-show', payload)
  );
};

export const getAllTheatresByMovie = (payload) => {
  return handleResponse(
    axiosInstance.post('/api/shows/get-all-theatres-by-movie', payload)
  );
};

export const getShowById = (payload) => {
  return handleResponse(
    axiosInstance.post('/api/shows/get-show-by-id', payload)
  );
};
