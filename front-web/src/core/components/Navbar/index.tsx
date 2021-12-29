import './styles.scss';

import { getAccessTokenDecoded, logout } from 'core/utils/auth';
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const Navbar = () => {

  const [currentUser, setCurrentUser] = useState('');
  const location = useLocation();

  useEffect(() => {
    const currentUserData = getAccessTokenDecoded();
    setCurrentUser(currentUserData.user_name);
  }, [location]);

  const handleLogout = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    logout();
  }

  return (
    <nav className="bg-primary main-nav">

      <Link to="/" className="nav-logo-text">
        <h4>DS Catalog</h4>
      </Link>

      <div className="menu-container">
        <ul className="main-menu">
          <li>
            {/* activeClassName default é 'active'. Pode ser customizado com activeClassName */}
            <NavLink className="nav-link" to="/" activeClassName="active" exact>HOME</NavLink>
          </li>
          <li>
            <NavLink className="nav-link" to="/products">CATÁLOGO</NavLink>
          </li>
          <li>
            <NavLink className="nav-link" to="/admin">ADMIN</NavLink>
          </li>
        </ul>
      </div>
      <div className="text-right">
        {currentUser && (
          <>
            {currentUser}
            <a
              href="#logout"
              className="nav-link active d-inline"
              onClick={handleLogout}>
              LOGOUT
            </a>
          </>
        )}
        {!currentUser && (
          <Link to="/auth/login" className="nav-link active">
            LOGIN
          </Link>
        )}
      </div>

    </nav>
  )
};

export default Navbar;