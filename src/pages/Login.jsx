import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, isAuthenticated, getUserRole } from '../utils/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/Login.scss';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(false);

  // Load remembered email if available
  useEffect(() => {
    if (isAuthenticated()) {
      const role = getUserRole();
      navigate(role === 'editor' ? '/editor' : '/admin');
    }

    const savedEmail = localStorage.getItem('remembered-email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('cms-users') || '[]');
    const match = users.find(
      (u) => u.email === email.trim() && u.password === password
    );

    if (match) {
      login(match.role || 'editor', 30, match.name);
      toast.success(`Welcome back, ${match.name}`);
      if (remember) {
        localStorage.setItem('remembered-email', email.trim());
      } else {
        localStorage.removeItem('remembered-email');
      }
      setTimeout(() => {
        navigate(match.role === 'admin' ? '/admin' : '/editor');
      }, 1000);
      return;
    }

    if (email === 'admin@example.com' && password === 'admin123') {
      login('admin', 30, 'Admin');
      if (remember) {
        localStorage.setItem('remembered-email', email.trim());
      } else {
        localStorage.removeItem('remembered-email');
      }
      toast.success('Welcome, Admin!');
      setTimeout(() => navigate('/admin'), 1000);
    } else {
      setError('Invalid credentials');
      toast.error('Login failed');
    }
  };

  return (
    <div className="login container">
      <ToastContainer />
      <form className="login__form" onSubmit={handleSubmit}>
        <h2 className="login__title">Login</h2>

        {error && <div className="login__error">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="login__password-wrapper">
          <input
            type={showPass ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="login__toggle"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? 'Hide' : 'Show'}
          </button>
        </div>

        <label className="login__remember">
          <input
            type="checkbox"
            checked={remember}
            onChange={() => setRemember(!remember)}
          />
          Remember Me
        </label>

        <button type="submit" className="login__submit">Login</button>
        <Link to="/register">Create an Account</Link>
      </form>
    </div>
  );
}

export default Login;
