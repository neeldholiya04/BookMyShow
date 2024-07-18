const { axiosInstance } = require('./index');

const handleRequest = async (method, url, data) => {
    try {
        const response = await axiosInstance[method](url, data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error.response || error.message;
    }
};

// Register new User
export const RegisterUser = async (value) => {
    return handleRequest('post', 'api/users/register', value);
};

// Login user
export const LoginUser = async (value) => {
    return handleRequest('post', 'api/users/login', value);
};

// Get current user from the frontend
export const GetCurrentUser = async () => {
    return handleRequest('get', 'api/users/get-current-user');
};

// Forget Password
export const ForgetPassword = async (value) => {
    return handleRequest('patch', 'api/users/forgetpassword', value);
};

// Reset Password
export const ResetPassword = async (value) => {
    return handleRequest('patch', 'api/users/resetpassword', value);
};
