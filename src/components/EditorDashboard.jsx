import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

    const postsWithStats = filtered.map((post) => {
      const likes = parseInt(localStorage.getItem(`likes-${post.id}`)) || 0;
      const comments = JSON.parse(localStorage.getItem(`comments-${post.id}`)) || [];
      return { ...post, likes, comments };
    });

    // ✅ Sort by most liked
    postsWithStats.sort((a, b) => b.likes - a.likes);

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
                Category: <strong>{post.category}</strong> • Tags:{' '}
                <em>{post.tags.join(', ') || 'None'}</em>
              </p>

              <p className="editor-dashboard__stats">
                ❤️ {post.likes} likes &nbsp; 💬 {post.comments.length} comments
              </p>

              {/* ✅ Preview latest 2 comments */}
              {post.comments.length > 0 && (
                <div className="editor-dashboard__preview-comments">
                  {post.comments.slice(-2).map((c, i) => (
                    <div key={i} className="editor-dashboard__comment">
                      <strong>{c.name}</strong>: {c.text}
                    </div>
                  ))}
                </div>
              )}

              {/* ✅ View Post Link */}
              <Link to={`/post/${post.id}`} className="editor-dashboard__view-link">
                View Full Post →
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default EditorDashboard;
