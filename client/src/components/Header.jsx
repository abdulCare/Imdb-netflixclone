import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, isAuthed, logout } = useAuth();

  return (
    <header className="app-header">
      <NavLink to="/" className="logo">
        AbdulFlix
      </NavLink>
      <nav>
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/search">Search</NavLink>
        {isAuthed && <NavLink to="/favorites">Favorites</NavLink>}
        {isAuthed && <NavLink to="/watchlists">Watchlists</NavLink>}
      </nav>
      <div className="auth-controls">
        {isAuthed ? (
          <>
            <span>{user.email}</span>
            <button type="button" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
