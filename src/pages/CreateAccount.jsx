import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import './styles/CreateAccount.scss';
import 'react-toastify/dist/ReactToastify.css';
import './styles/CreateAccount.scss'

function CreateAccount() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('cms-users') || '[]');

    const userExists = users.some((u) => u.email === form.email.trim());
    if (userExists) {
      toast.error('Email already registered');
      return;
    }

    const newUser = {
      id: Date.now(),
      ...form,
      email: form.email.trim(),
      name: form.name.trim(),
      role: 'editor',
    };

    localStorage.setItem('cms-users', JSON.stringify([...users, newUser]));
    toast.success('Account created! You can now log in.');

    setTimeout(() => navigate('/login'), 1500);
  };

  return (
    <div className="create-account container">
      <ToastContainer />
      <form className="create-account__form" onSubmit={handleSubmit}>
        <h2>Create an Account</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <div className="create-account__password">
          <input
            type={showPass ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? 'Hide' : 'Show'}
          </button>
        </div>

        <button type="submit" className="create-account__submit">
          Create Account
        </button>
      </form>
    </div>
  );
}

export default CreateAccount;
