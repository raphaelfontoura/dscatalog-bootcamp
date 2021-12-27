import './styles.scss';

import { CategoryResponse } from 'core/types/Category';
import history from 'core/utils/history';
import { makePrivateRequest, makeRequest } from 'core/utils/request';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import CategoryCard from '../Card';
import Pagination from 'core/components/Pagination';


const CategoryList = () => {

  const [categories, setCategories] = useState<CategoryResponse>()
  const [isLoading, setIsLoading] = useState(false)
  const [activePage, setActivePage] = useState(0);

  const getCategorias = useCallback(() => {
    const params = {
      page: activePage,
      linesPerPage: 6,
      direction: 'DESC',
      orderBy: 'id'
    }

    setIsLoading(true);
    try {
      makeRequest({ url: "/categories", params })
        .then(response => setCategories(response.data))
        .finally(() => {
          setIsLoading(false);
        });
    } catch (err) {
      console.log(err);
    }
  }, [activePage])

  useEffect(() => {
    getCategorias();
  }, [getCategorias]);

  const onRemove = (categoryId: number) => {
    const confirm = window.confirm('Deseja excluir este produto?');
    if (confirm) {
      makePrivateRequest({ url: `/categories/${categoryId}`, method: 'DELETE' })
        .then(() => {
          toast.info('Categoria removida com sucesso!');
          getCategorias();
        })
        .catch(() => toast.error('Erro ao remover a categoria!'))
    }
  }

  const handleCreate = () => {
    history.push("/admin/categories/create");
  }

  return (
    <div>
      <button className="btn btn-primary btn-lg" onClick={handleCreate}>
        ADICIONAR
      </button>
      <div className="category-list-container">
        {categories?.content.map(category => (
          <CategoryCard category={category} key={category.id} onRemove={onRemove} />
        ))}
      </div>
      {categories && (
          <Pagination
            totalPages={categories.totalPages}
            activePage={activePage}
            onChange={page => setActivePage(page)}
          />
        )}
    </div>
  )
}

export default CategoryList
