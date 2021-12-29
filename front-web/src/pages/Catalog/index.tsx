import './styles.scss';

import Pagination from 'core/components/Pagination';
import ProductFilters from 'core/components/ProductFilters';
import { ProductsResponse } from 'core/types/Product';
import { makeRequest } from 'core/utils/request';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import ProductCardLoader from './components/Loaders/ProductCardLoader';
import ProductCard from './components/ProductCard';
import { Category } from 'core/types/Category';


const Catalog = () => {

  const [productsResponse, setProductsResponse] = useState<ProductsResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>();

  const getProducts = useCallback(() => {
    const params = {
      page: activePage,
      linesPerPage: 6,
      name,
      categoryId: category?.id
    }

    setIsLoading(true);
    try {
      makeRequest({ url: "/products", params })
        .then(response => setProductsResponse(response.data))
        .finally(() => {
          setIsLoading(false);
        });
    } catch (err) {
      console.log(err);
    }
  }, [activePage, name, category]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);



  const handleChangeName = (name: string) => {
    setActivePage(0);
    setName(name);
  }

  const handleChangeCategory = (category: Category) => {
    setActivePage(0);
    setCategory(category);
  }

  const clearFilters = () => {
    setActivePage(0);
    setCategory(undefined);
    setName('');
  }

  return (
    <div className="catalog-container">
      <div className="filter-container">
        <h1 className="catalog-title">
          Catálogo de produtos
        </h1>
        <ProductFilters
          name={name}
          category={category}
          handleChangeCategory={handleChangeCategory}
          handleChangeName={handleChangeName}
          clearFilters={clearFilters}
        />
      </div>

      <div className="catalog-products">
        {isLoading ? <ProductCardLoader /> : (
          productsResponse?.content.map(product => (
            <Link to={`/products/${product.id}`} key={product.id}>
              <ProductCard product={product} />
            </Link>
          ))
        )}
      </div>
      {productsResponse && (
        <Pagination
          totalPages={productsResponse.totalPages}
          activePage={activePage}
          onChange={page => setActivePage(page)}
        />
      )}
    </div>
  );
}

export default Catalog;