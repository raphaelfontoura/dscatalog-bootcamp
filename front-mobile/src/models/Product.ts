import { Category } from "./Category";

export interface Product {
  id?: number;
  name: string;
  price: number | string;
  imgUrl: string;
  description: string;
  date?: string,
  categories: Category[],
}