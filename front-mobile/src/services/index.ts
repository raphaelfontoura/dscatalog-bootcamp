import axios from "axios";


export const api = axios.create({
  baseURL: "http://192.168.0.108:8080"
});

export const TOKEN = "Basic ZHNjYXRhbG9nOmRzY2F0YWxvZzEyMw==";

export function getProducts() {
  const response = api.get(`/products?page=0&linesPerPage=12&direction=ASC&orderBy=name`);
  return response;
}

export function getCategories() {
  const response = api.get(`/categories?direction=ASC&orderBy=name`);
  return response;
}