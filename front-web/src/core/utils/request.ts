import axios, { Method } from "axios";

type RequestParams = {
    method?: Method;
    url: string;
    data?: object;
    params?: object;
}

const BASE_URL = "http://localhost:3000"; //url to local port app and proxy on package.json will be translate to localhost:8080

export const makeRequest = ({ method = "GET", url, data, params }:RequestParams) => {
    return axios({
        method,
        url: `${BASE_URL}${url}`,
        data,
        params
    });
}