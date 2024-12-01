import axios from "axios";

export const API_url = "http://localhost:5000/api";

const $api = axios.create({
    withCredentials: true,
    baseURL: API_url
})

$api.interceptors.response.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config;
})

export default $api;