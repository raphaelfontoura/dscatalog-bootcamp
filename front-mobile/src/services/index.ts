import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import mime from "mime";

import axios from "axios";
import { Product } from '../models/Product';


export const api = axios.create({
  baseURL: "http://192.168.0.108:8080"
});

export const TOKEN = "Basic ZHNjYXRhbG9nOmRzY2F0YWxvZzEyMw==";

export async function userToken() {
  const token = await AsyncStorage.getItem("@token");
  return token;
}

// Backend requests

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

export async function deleteProduct(id: number) {
  const authToken = await userToken();
  const res = api.delete(`/products/${id}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    }
  })
}

export async function getProduct(id:number) {
  const res = await api.get(`/products/${id}`);
  return res;
}

export async function updateProduct(data: Product) {
  const authToken = await userToken();
  const res = await api.put(`/products/${data.id}`, data, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return res;
}

export function getCategories() {
  const response = api.get(`/categories?direction=ASC&orderBy=name`);
  return response;
}

// Image Upload
export async function uploadImage(image: string) {
  if (!image) return;
  const authToken = await userToken();
  let data = new FormData();

  // data.append("file", {
  //   //@ts-ignore
  //   uri: image,
  //   name: image,
  // });

  if (Platform.OS === "android") {
    console.log("Entrei no android")
    const newImageUri = "file:///" + image.split("file:/").join("");

    data.append("file", {
      uri: newImageUri,
      type: mime.getType(image),
      name: newImageUri,
    });
  } else if (Platform.OS === "ios") {
    data.append("file", {
      uri: image,
      name: image
    });
  }

  const res = await api.post(`/products/image`, data, {
    headers: {
      Authorization:`Bearer ${authToken}`,
      'Content-Type':'multipart/form-data',
    },
  }).catch(err => console.log(err));

  return res;
}

