import { useEffect, useState } from 'react';
import { getPosts } from '../utils/storage';
import { getAuthorName } from '../utils/auth';
import './styles/EditorDashboard.scss';

function EditorDashboard() {
  
  const [stats, setStats] = useState({
    total: 0,
    categories: [],
    tags: [],
    latestDate: null,
  });
  const [myPosts, setMyPosts] = useState([]);

  const author = getAuthorName();

  useEffect(() => {
    const allPosts = Array.isArray(getPosts()) ? getPosts() : [];
    const filtered = allPosts.filter((p) => p.author === author);

    // Simulate views/comments (real logic would come from a DB)
    const postsWithStats = filtered.map((post) => ({
      ...post,
      views: Math.floor(Math.random() * 500),
      comments: Math.floor(Math.random() * 20),
    }));

    const allTags = filtered.flatMap((p) => p.tags || []);
    const allCategories = filtered.map((p) => p.category || 'uncategorized');
    const latest = filtered
      .map((p) => p.createdAt)
      .sort()
      .reverse()[0];

    setStats({
      total: filtered.length,
      categories: [...new Set(allCategories)],
      tags: [...new Set(allTags)],
      latestDate: latest ? new Date(latest).toLocaleDateString() : 'N/A',
    });

    setMyPosts(postsWithStats);
  }, [author]);

  return (
    <div className="editor-dashboard">
      <h2>Welcome, {author}</h2>

      <div className="editor-dashboard__grid">
        <div className="card">
          <h3>Total Posts</h3>
          <p>{stats.total}</p>
        </div>
        <div className="card">
          <h3>Categories</h3>
          <p>{stats.categories.join(', ') || 'None'}</p>
        </div>
        <div className="card">
          <h3>Tags Used</h3>
          <p>{stats.tags.length}</p>
        </div>
        <div className="card">
          <h3>Latest Post</h3>
          <p>{stats.latestDate}</p>
        </div>
      </div>

      <hr className="editor-dashboard__divider" />

      <h3 className="editor-dashboard__subheading">My Posts</h3>
      <div className="editor-dashboard__posts">
        {myPosts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          myPosts.map((post) => (
            <div key={post.id} className="editor-dashboard__post-card">
              <h4>{post.title}</h4>
              <p className="editor-dashboard__meta">
                Category: <strong>{post.category}</strong> •{' '}
                Tags: <em>{post.tags.join(', ') || 'None'}</em>
              </p>
              <p className="editor-dashboard__stats">
                👁 {post.views} views &nbsp; 💬 {post.comments} comments
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default EditorDashboard;
