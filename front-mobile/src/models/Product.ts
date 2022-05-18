import { Category } from "./Category";

export interface Product {
  id?: number;
  name: string;
  price: string | number;
  imgUrl: string;
  description: string;
  date?: string,
  categories: Category[],
}