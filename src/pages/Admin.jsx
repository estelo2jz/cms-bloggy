import { useState } from 'react';
import { getPosts, savePosts } from '../utils/storage';
import LogoutButton from '../components/LogoutButton';
import './styles/Admin.scss';

function Admin() {
  const [posts, setPosts] = useState(() => {
    const stored = getPosts();
    return Array.isArray(stored) ? stored : [];
  });

  const [form, setForm] = useState({
    title: '',
    content: '',
    tags: '',
    image: '',
    category: '',
  });

  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // const newPost = {
    //   id: editId || Date.now(),
    //   title: form.title,
    //   content: form.content,
    //   tags: form.tags
    //     ? form.tags.split(',').map((tag) => tag.trim().toLowerCase())
    //     : [],
    //   image: form.image || '',
    //   category: form.category || 'uncategorized',
    //   createdAt: new Date().toISOString()
    // };

    const newPost = {
      id: editId || Date.now(),
      title: form.title,
      content: form.content,
      tags: form.tags.split(','),
      image: form.image || '',
      category: form.category || 'uncategorized',
      createdAt: new Date().toISOString() // ✅ Add this line
    };
    

    const updatedPosts = editId
      ? posts.map((p) => (p.id === editId ? newPost : p))
      : [...posts, newPost];

    savePosts(updatedPosts);
    setPosts(updatedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    setForm({ title: '', content: '', tags: '', image: '', category: '' });
    setEditId(null);
  };

  const handleEdit = (post) => {
    setForm({
      title: post.title,
      content: post.content,
      tags: post.tags?.join(', ') || '',
      image: post.image || '',
      category: post.category || ''
    });
    setEditId(post.id);
  };

  const handleDelete = (id) => {
    const filtered = posts.filter((p) => p.id !== id);
    savePosts(filtered);
    setPosts(filtered);
    if (editId === id) {
      setForm({ title: '', content: '', tags: '', image: '', category: '' });
      setEditId(null);
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ title: '', content: '', tags: '', image: '', category: '' });
  };

  return (
    <div className="admin container">
      <h1 className="admin__heading">Admin Dashboard</h1>
      <LogoutButton />
      <form className="admin__form" onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="Content"
          value={form.content}
          onChange={handleChange}
          required
        />
        <input
          name="tags"
          placeholder="Tags (comma-separated)"
          value={form.tags}
          onChange={handleChange}
        />
        <input
          name="category"
          placeholder="Category (e.g., Tech, Travel)"
          value={form.category}
          onChange={handleChange}
        />
        <input type="file" accept="image/*" onChange={handleImage} />
        {form.image && (
          <img
            src={form.image}
            alt="Preview"
            className="admin__preview"
          />
        )}
        <div className="admin__buttons">
          <button type="submit">
            {editId ? 'Update Post' : 'Add Post'}
          </button>
          {editId && (
            <button type="button" onClick={handleCancel} className="admin__cancel">
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="admin__subheading">Posts</h2>
      <div className="admin__posts">
        {posts.map((post) => (
          <div key={post.id} className="admin__post">
            <h3>{post.title}</h3>
            <div className="admin__actions">
              <button onClick={() => handleEdit(post)}>Edit</button>
              <button onClick={() => handleDelete(post.id)} className="admin__delete">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;
