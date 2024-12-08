import axios from 'axios';
import {apiPaths} from '../api/apiPaths';
import store from "../store";


const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/birds",
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
});

axiosInstance.interceptors.request.use(
    config => {
        const excludedPaths = [
            apiPaths.species,
            apiPaths.observationData,
            apiPaths.login,
            apiPaths.register,
            apiPaths.leaderboard
        ];
        const excludedPathsInUrl = excludedPaths.filter(path => config.url.includes(path));
        if (excludedPathsInUrl.length > 0) {
            return config;
        }
        const token = store.getState().authSlice.token;
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    response => response,
    error => {


        switch (error.response.status) {
            case 403:
                window.location.href = '/error?errorCode=403';
                break;
            case 404:
                window.location.href = '/error?errorCode=404';
                break;
            default:
                return Promise.reject(error);
        }
    }
);

export default axiosInstance;
