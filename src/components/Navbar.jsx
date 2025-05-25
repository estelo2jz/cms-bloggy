import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../utils/auth';
import './styles/Navbar.scss';

function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const isAuth = isAuthenticated();
  const role = getUserRole(); // ✅ Get role from localStorage

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <h2 className="navbar__logo">BLOGGY</h2>

        <button className="navbar__toggle" onClick={toggleMenu}>
          ☰
        </button>

        <div className={`navbar__links ${menuOpen ? 'open' : ''}`}>
          <Link
            to="/"
            className={location.pathname === '/' ? 'active' : ''}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          {/* ✅ Show Admin link only for admin role */}
          {isAuth && role === 'admin' && (
            <Link
              to="/admin"
              className={location.pathname === '/admin' ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              Admin
            </Link>
          )}

          {/* ✅ Show Editor link only for editor role */}
          {isAuth && role === 'editor' && (
            <Link
              to="/editor"
              className={location.pathname === '/editor' ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              Editor
            </Link>
          )}

          {isAuth ? (
            <Link
              to="/logout"
              onClick={() => setMenuOpen(false)}
            >
              Logout
            </Link>
          ) : (
            <Link
              to="/login"
              className={location.pathname === '/login' ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
