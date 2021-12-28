import './styles.scss';

import Pagination from 'core/components/Pagination';
import { UserResponse } from 'core/types/User';
import history from 'core/utils/history';
import { makePrivateRequest } from 'core/utils/request';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import CardLoader from '../../Products/Loaders';
import UserCard from '../Card';


const UserList = () => {

  const [users, setUsers] = useState<UserResponse>()
  const [isLoading, setIsLoading] = useState(false)
  const [activePage, setActivePage] = useState(0);

  const getUsers = useCallback(() => {
    const params = {
      page: activePage,
      linesPerPage: 6,
      direction: 'DESC',
      orderBy: 'id'
    }

    setIsLoading(true);
    try {
      makePrivateRequest({ url: "/users", params })
        .then(response => setUsers(response.data))
        .finally(() => {
          setIsLoading(false);
        });
    } catch (err) {
      console.log(err);
    }
  }, [activePage])

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const onRemove = (userId: number) => {
    const confirm = window.confirm('Deseja excluir este usuário?');
    if (confirm) {
      makePrivateRequest({ url: `/users/${userId}`, method: 'DELETE' })
        .then(() => {
          toast.info('Usuário deletado com sucesso!');
          getUsers();
        })
        .catch(() => toast.error('Erro ao remover o usuário!'))
    }
  }

  const handleCreate = () => {
    history.push("/admin/users/create");
  }

  return (
    <div>
      <button className="btn btn-primary btn-lg" onClick={handleCreate}>
        ADICIONAR
      </button>
      {isLoading ? <CardLoader /> : (
        <div className="category-list-container">
          {users?.content.map(user => (
            <UserCard user={user} key={user.id} onRemove={onRemove} />
          ))}
        </div>
      )}
      {users && (
        <Pagination
          totalPages={users.totalPages}
          activePage={activePage}
          onChange={page => setActivePage(page)}
        />
      )}
    </div>
  )
}

export default UserList
