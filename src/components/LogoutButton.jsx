// components/LogoutButton.jsx
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
import './styles/LogoutButton.scss';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();              // ✅ clears auth
    navigate('/login');    // ✅ redirects
  };

  return (
    <button onClick={handleLogout} className="logout-btn">
      Logout
    </button>
  );
}

export default LogoutButton;
