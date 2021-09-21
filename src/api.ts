import axios from "axios";

const api = axios.create({
    baseURL: 'http://49.50.167.136:9871'
});

export default api;