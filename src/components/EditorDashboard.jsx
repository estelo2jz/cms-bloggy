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

  const author = getAuthorName();

  useEffect(() => {
    const allPosts = Array.isArray(getPosts()) ? getPosts() : [];
    const myPosts = allPosts.filter((p) => p.author === author);

    const allTags = myPosts.flatMap((p) => p.tags || []);
    const allCategories = myPosts.map((p) => p.category || 'uncategorized');
    const latest = myPosts
      .map((p) => p.createdAt)
      .sort()
      .reverse()[0];

    setStats({
      total: myPosts.length,
      categories: [...new Set(allCategories)],
      tags: [...new Set(allTags)],
      latestDate: latest ? new Date(latest).toLocaleDateString() : 'N/A',
    });
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
    </div>
  );
}

export default EditorDashboard;
