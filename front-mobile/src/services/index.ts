import axios from "axios";
import { userToken } from "./auth";


export const api = axios.create({
  baseURL: "http://192.168.0.108:8080"
});

export function getProducts() {
  const response = api.get(`/products?direction=DESC&orderBy=id`);
  return response;
}

export async function createProduct(data: object) {
  const authToken = await userToken();
  const res = api.post(`/products`, data, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    }
  });
  return res;
}

export function getCategories() {
  const response = api.get(`/categories?direction=ASC&orderBy=name`);
  return response;
}

