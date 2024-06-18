import { TMDB_API_KEY } from '@env'
import axios from 'axios';

const BASE_URL = 'http://api.themoviedb.org/3';

const axiosApiInstance = axios.create({
    baseURL: BASE_URL
});

axiosApiInstance.interceptors.request.use(
    async (config) => {
        config.headers = {
            Authorization: "Bearer" + " " + TMDB_API_KEY,
            accept: 'application/json'
        };
        return config;
    },
    (error) => {
        Promise.reject(error);
    },
);

axiosApiInstance.interceptors.response.use(
    async (response) => {
        return Promise.resolve(response);
    },
    async (error) => {
        return Promise.reject(error);
    },
);

export default axiosApiInstance;
