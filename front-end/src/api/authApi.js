import axiosInstance from '../utils/axiosSetup';
import {apiPaths} from './apiPaths';

export const authApi = {
    handleLogin: (values) => axiosInstance.post(apiPaths.login, values),
    handleRegister: (values) => axiosInstance.post(apiPaths.register, values),
}