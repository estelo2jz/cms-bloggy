import DashboardLayout from '../components/DashboardLayout';
import EditorDashboard from '../components/EditorDashboard';
import EditorNewPost from '../components/EditorNewPost';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../utils/auth';
import './styles/Editor.scss';

function Editor() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated() || getUserRole() !== 'editor') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <DashboardLayout title="">
      <EditorDashboard />
      <hr style={{ margin: '2rem 0' }} />
      <EditorNewPost />
    </DashboardLayout>
  );
}

export default Editor;
