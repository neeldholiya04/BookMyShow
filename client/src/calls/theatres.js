import { axiosInstance } from ".";

const handleResponse = async (request) => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response || error.message;
  }
};

export const addTheatre = (payload) => {
  return handleResponse(
    axiosInstance.post('/api/theatres/add-theatre', payload)
  );
};

// Get all theatres for the Admin route
export const getAllTheatresForAdmin = () => {
  return handleResponse(
    axiosInstance.get('/api/theatres/get-all-theatres')
  );
};

// Get theatres of a specific owner
export const getAllTheatres = (payload) => {
  return handleResponse(
    axiosInstance.post('/api/theatres/get-all-theatres-by-owner', payload)
  );
};

// Update Theatre
export const updateTheatre = (payload) => {
  return handleResponse(
    axiosInstance.put('/api/theatres/update-theatre', payload)
  );
};

// Delete Theatre
export const deleteTheatre = (payload) => {
  return handleResponse(
    axiosInstance.put('/api/theatres/delete-theatre', payload)
  );
};
