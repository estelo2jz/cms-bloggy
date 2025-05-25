import { Link } from 'react-router-dom';
import './styles/Sidebar.scss';

function Sidebar() {
  return (
    <aside className="sidebar">
      <h3>Admin Panel</h3>
      <ul>
        <li><Link to="/admin">Dashboard</Link></li>
        <li><Link to="/logout">Logout</Link></li>
      </ul>
    </aside>
  );
}

export default Sidebar;
