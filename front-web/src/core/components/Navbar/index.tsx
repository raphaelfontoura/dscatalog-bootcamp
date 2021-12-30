import './styles.scss';

import { getAccessTokenDecoded, logout } from 'core/utils/auth';
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

import menu from "../../assets/images/menu.svg"
import { loadingMessageCSS } from 'react-select/dist/declarations/src/components/Menu';

const Navbar = () => {

  const [drawerActive, setDrawerActive] = useState(false);
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

      <button className="menu-mobile-button" type="button" onClick={() => setDrawerActive(!drawerActive)}>
        <img src={menu} alt="Mobile Menu" />
      </button>

      <div className={drawerActive ? "menu-mobile-container" : "menu-container"}>
        <ul className="main-menu">
          <li>
            {/* activeClassName default é 'active'. Pode ser customizado com activeClassName */}
            <NavLink className="nav-link" to="/" activeClassName="active" exact onClick={() => setDrawerActive(false)}>
              HOME
            </NavLink>
          </li>
          <li>
            <NavLink className="nav-link" to="/products" onClick={() => setDrawerActive(false)}>
              CATÁLOGO
            </NavLink>
          </li>
          <li>
            <NavLink className="nav-link" to="/admin" onClick={() => setDrawerActive(false)}>
              ADMIN
            </NavLink>
          </li>
          {drawerActive && (
            <li>
              {currentUser && (
                <a href="#logout" className="nav-link active d-inline" onClick={(e) => {
                  setDrawerActive(false)
                  handleLogout(e)
                }}>
                  {`LOGOUT - ${currentUser}`}
                </a>
              )}
            </li>
          )}
          {drawerActive && (
            <>
              {!currentUser && (
                <li>
                  <Link to="/auth/login" className="nav-link active" onClick={() => setDrawerActive(false)}>
                    LOGIN
                  </Link>
                </li>
              )}
            </>
          )}
        </ul>
      </div>
      <div className="user-info-dnone text-right">
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