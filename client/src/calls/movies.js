import { axiosInstance } from './index';

const handleResponse = async (request) => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response;
  }
};

export const getAllMovies = () => {
  return handleResponse(
    axiosInstance.get('api/movies/get-all-movies')
  );
};

export const addMovie = (values) => {
  return handleResponse(
    axiosInstance.post('api/movies/add-movie', values)
  );
};

export const updateMovie = (payload) => {
  return handleResponse(
    axiosInstance.put('/api/movies/update-movie', payload)
  );
};

export const deleteMovie = (payload) => {
  return handleResponse(
    axiosInstance.put('/api/movies/delete-movie', payload)
  );
};

export const getMovieById = (id) => {
  return handleResponse(
    axiosInstance.get(`/api/movies/movie/${id}`)
  );
};
