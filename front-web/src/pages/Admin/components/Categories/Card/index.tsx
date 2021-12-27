import './styles.scss';

import { Category } from 'core/types/Category';
import { Link } from 'react-router-dom';

type Props = {
  category: Category;
  onRemove: (categoryId: number) => void;
}

const CategoryCard = ({ category, onRemove }: Props) => {
  return (
    <div className="card-base category-card">
      <div className='col-7 py-3'>
        <h3 className='category-card-title'>{category.name}</h3>
      </div>
      <div className='col-5 category-card-buttons'>
        <Link
          to={`/admin/categories/${category.id}`}
          type='button'
          className='btn btn-outline-secondary btn-block border-radius-10 mr-3'>
          EDITAR
        </Link>
        <button
          type='button'
          className='btn btn-outline-danger btn-block border-radius-10 mb-2'
          onClick={() => onRemove(category.id)}
        >
          EXCLUIR
        </button>
      </div>
    </div>
  )
}

export default CategoryCard
