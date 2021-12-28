import './styles.scss';

import { Link } from 'react-router-dom';
import { User } from 'core/types/User';

type Props = {
  user: User;
  onRemove: (userId: number) => void;
}

const UserCard = ({ user, onRemove }: Props) => {
  return (
    <div className="card-base category-card">
      <div className='col-7 py-3'>
        <h3 className='category-card-title'>{user.firstName} {user.lastName}</h3>
      </div>
      <div className='col-5 category-card-buttons'>
        <Link
          to={`/admin/users/${user.id}`}
          type='button'
          className='btn btn-outline-secondary btn-block border-radius-10 mr-3'>
          EDITAR
        </Link>
        <button
          type='button'
          className='btn btn-outline-danger btn-block border-radius-10 mb-2'
          onClick={() => onRemove(user.id!)}
        >
          EXCLUIR
        </button>
      </div>
    </div>
  )
}

export default UserCard
