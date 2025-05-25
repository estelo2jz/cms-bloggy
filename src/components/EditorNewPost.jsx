import { useState } from 'react';
import { getPosts, savePosts } from '../utils/storage';
import './styles/EditorNewPost.scss';
import { getAuthorName } from '../utils/auth';

function EditorNewPost() {
  const [form, setForm] = useState({
    title: '',
    content: '',
    tags: '',
    image: '',
    category: '',
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
      setPreviewImage(reader.result);
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPost = {
      id: Date.now(),
      title: form.title,
      content: form.content,
      tags: form.tags
        ? form.tags.split(',').map((tag) => tag.trim().toLowerCase())
        : [],
      image: form.image || '',
      category: form.category || 'uncategorized',
      author: getAuthorName() || 'Unknown', // ✅ Add author
      createdAt: new Date().toISOString(),
    };

    const existingPosts = Array.isArray(getPosts()) ? getPosts() : [];
    const updated = [...existingPosts, newPost];

    savePosts(updated);
    setSuccess(true);
    setForm({ title: '', content: '', tags: '', image: '', category: '' });
    setPreviewImage(null);

    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="editor-post container">
      <h2>Create New Blog Post</h2>

      {success && <p className="editor-post__success">Post created successfully!</p>}

      <form className="editor-post__form" onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Post Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="Write your post content..."
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
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
        />
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="editor-post__image"
          />
        )}
        <button type="submit" className="editor-post__submit">Publish Post</button>
      </form>
    </div>
  );
}

export default EditorNewPost;
