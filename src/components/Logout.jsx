import { useEffect } from 'react';
import { logout } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate('/login');
  }, [navigate]);

  return null;
}

export default Logout;
