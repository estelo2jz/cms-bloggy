import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../utils/storage';
import ReactMarkdown from 'react-markdown';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './styles/Home.scss';

function Home() {
  const [posts, setPosts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    AOS.init({ duration: 600, once: true });

    const stored = getPosts();
    const sorted = Array.isArray(stored)
      ? stored.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      : [];
    setPosts(sorted);
  }, []);

  const categories = ['all', ...new Set(posts.map(p => p.category?.toLowerCase() || 'uncategorized'))];
  const tags = [...new Set(posts.flatMap(p => p.tags || []))];

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

  const featuredPost = filtered[0];
  const remainingPosts = filtered.slice(1);
  const visiblePosts = remainingPosts.slice(0, visibleCount);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <div className="home">
      <h1 className="home__heading"></h1>

      <div className="home__filters">
        <input
          type="text"
          className="home__search"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="home__select"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setVisibleCount(6);
          }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="home__layout">
        <div className="home__content">
          {featuredPost && (
            <div className="home__featured" data-aos="fade-up">
              {featuredPost.image && (
                <img src={featuredPost.image} alt="featured" className="home__featured-img" />
              )}
              <div className="home__featured-body">
                <h2>{featuredPost.title}</h2>
                <ReactMarkdown>
                  {featuredPost.content.substring(0, 150) + '...'}
                </ReactMarkdown>
                <Link to={`/post/${featuredPost.id}`} className="home__read-link">
                  Read more →
                </Link>
              </div>
            </div>
          )}

          <div className="home__grid">
            {visiblePosts.map((post) => (
              <div key={post.id} className="home__card" data-aos="fade-up">
                {post.image && (
                  <img src={post.image} alt={post.title} className="home__card-img" />
                )}
                <div className="home__card-body">
                  <Link to={`/post/${post.id}`}>
                    <h3>{post.title}</h3>
                  </Link>
                  <ReactMarkdown>
                    {post.content.substring(0, 100) + '...'}
                  </ReactMarkdown>
                  <div className="home__card-meta">
                    <span className="home__category">{post.category}</span>
                    <div className="home__tags">
                      {post.tags?.map((tag, i) => (
                        <span key={i}>#{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {visibleCount < remainingPosts.length && (
            <div className="home__load">
              <button onClick={loadMore}>Load More</button>
            </div>
          )}
        </div>

        <aside className="home__sidebar" data-aos="fade-left">
          <h4>Trending Tags</h4>
          <div className="home__tag-list">
            {tags.length === 0 ? <p>No tags yet.</p> : tags.map((t, i) => <span key={i}>#{t}</span>)}
          </div>

          <h4>Categories</h4>
          <ul>
            {categories.filter(c => c !== 'all').map((cat, i) => (
              <li key={i}>{cat}</li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

export default Home;
