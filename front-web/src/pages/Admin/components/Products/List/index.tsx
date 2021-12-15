import Pagination from 'core/components/Pagination';
import { ProductsResponse } from 'core/types/Product';
import { makeRequest } from 'core/utils/request';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import Card from '../Card';


const List = () => {
  const [productsResponse, setProductsResponse] = useState<ProductsResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const history = useHistory();

  useEffect(() => {
    const params = {
      page: activePage,
      linesPerPage: 6,
      direction: 'DESC',
      orderBy: 'id'
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
  }, [activePage]);

  const handleCreate = () => {
    history.push("/admin/products/create");
  }

  return (
    <div className="admin-products-list">
      <button className="btn btn-primary btn-lg" onClick={handleCreate}>
        ADICIONAR
      </button>
      <div className="admin-list-container">
        {isLoading && (
          <div>carregando...</div>
        )}
        {productsResponse?.content.map(product => (
          <Card product={product} key={product.id} />
        ))}

        {productsResponse && (
          <Pagination
            totalPages={productsResponse.totalPages}
            activePage={activePage}
            onChange={page => setActivePage(page)}
          />
        )}
      </div>
    </div>
  );
}

export default List;