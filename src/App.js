import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';
import PostDetail from './pages/PostDetail';
import CreateAccount from './pages/CreateAccount';
import Editor from './pages/Editor';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Logout from './components/Logout';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<CreateAccount />} />

        {/* ✅ Only protected admin route */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />
        <Route path="/editor" element={
          <PrivateRoute>
            <Editor />
          </PrivateRoute>
        } />

      </Routes>
    </Router>
  );
}

export default App;
