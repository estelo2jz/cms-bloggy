import LogoutButton from './LogoutButton';
import './styles/DashboardLayout.scss';

function DashboardLayout({ title, children }) {
  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h2>{title}</h2>
      </header>
      <main className="dashboard__main">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
