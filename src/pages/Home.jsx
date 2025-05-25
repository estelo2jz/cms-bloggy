import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../utils/storage';
import ReactMarkdown from 'react-markdown';
import './styles/Home.scss'; // Assuming correct path

function Home() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' = newest first


  useEffect(() => {
    const stored = getPosts();
    const sorted = Array.isArray(stored)
      ? stored.sort((a, b) =>
        sortOrder === 'desc'
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt)
      )
      : [];

    setPosts(sorted);
  }, [sortOrder]);


  const categories = ['all', ...new Set(posts.map(p => p.category?.toLowerCase() || 'uncategorized'))];

  const filtered = posts.filter((post) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      post.title.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchLower));

    const matchesCategory =
      selectedCategory === 'all' || post.category?.toLowerCase() === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filtered.length / postsPerPage);
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentPosts = filtered.slice(indexOfFirst, indexOfLast);

  return (
    <div className="home container">
      <h1 className="home__heading">Blog Home</h1>
      <div className="home__filters">
        <select
          className="home__select"
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>

        <input
          type="text"
          className="home__search"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          className="home__select"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Featured Post */}
      {currentPage === 1 && filtered.length > 0 && (
        <div className="home__featured">
          <h2>Featured Post</h2>
          <Link to={`/post/${filtered[0].id}`}>
            <h3>{filtered[0].title}</h3>
          </Link>
          <p className="home__date">
            {new Date(filtered[0].createdAt).toLocaleDateString()}
          </p>
          {filtered[0].image && (
            <img
              src={filtered[0].image}
              alt={filtered[0].title}
              className="home__featured-image"
            />
          )}
          <div className="home__content">
            <ReactMarkdown>
              {filtered[0].content.substring(0, 120) + '...'}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* Remaining Posts */}
      {currentPosts
        .filter((_, index) => !(currentPage === 1 && index === 0)) // skip first post if it's featured
        .map((post) => (
          <div key={post.id} className="post-preview">
            <Link to={`/post/${post.id}`} className="post-preview__title">
              <h3>{post.title}</h3>
            </Link>
            <p className="post-preview__date">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="post-preview__image"
              />
            )}
            <div className="post-preview__content">
              <ReactMarkdown>
                {post.content.substring(0, 100) + '...'}
              </ReactMarkdown>
            </div>
            {post.tags?.length > 0 && (
              <p className="post-preview__tags">
                <strong>Tags:</strong> {post.tags.join(', ')}
              </p>
            )}
            {post.category && (
              <p className="post-preview__category">
                <strong>Category:</strong> {post.category}
              </p>
            )}
          </div>
        ))}


      {/* Pagination */}
      {totalPages > 1 && (
        <div className="home__pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`home__page-btn ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
