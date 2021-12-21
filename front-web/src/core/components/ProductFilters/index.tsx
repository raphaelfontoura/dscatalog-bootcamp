import './styles.scss';
import { ReactComponent as SearchIcon } from 'core/assets/images/search-icon.svg';
import Select from 'react-select/dist/declarations/src/Select';
import { useEffect, useState } from 'react';
import { makeRequest } from 'core/utils/request';
import { Category } from 'core/types/Category';

const ProductFilters = () => {

  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setIsLoadingCategories(true);
    makeRequest({ url: '/categories' })
      .then(response => setCategories(response.data.content))
      .finally(() => setIsLoadingCategories(false));
  }, [])

  return (
    <div className="card-base product-filters-container">
      <div className="input-search">
        <input
          type="text"
          className="form-control"
          placeholder="Pesquisar produto"
        />
        <SearchIcon />
      </div>
      <Select
        options={categories}
        getOptionLabel={(option: Category) => option.name}
        getOptionValue={(option: Category) => String(option.id)}
        classNamePrefix="categories-select"
        placeholder="Categorias"
        isMulti
        isLoading={isLoadingCategories}
      />
    </div>
  )
}

export default ProductFilters
