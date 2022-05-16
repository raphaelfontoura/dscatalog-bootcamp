import { Category } from "./Category";

export interface Product {
  id: number;
  name: string;
  price: number;
  imgUrl: string;
  description: string;
  date: string,
  categories: Category[],
}