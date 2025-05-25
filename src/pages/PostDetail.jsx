import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPosts } from '../utils/storage';
import { getAuthorName } from '../utils/auth';
import ReactMarkdown from 'react-markdown';
import './styles/PostDetail.scss';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [visibleComments, setVisibleComments] = useState(3);

  const author = getAuthorName();

  const getFallbackImage = (prompt = 'blog') =>
    `https://source.unsplash.com/800x400/?${encodeURIComponent(prompt)}`;

  const getInitials = (name = 'User') => {
    const parts = name.trim().split(' ');
    return parts.length > 1
      ? parts[0][0] + parts[1][0]
      : parts[0][0] + parts[0][1];
  };

  const timeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    const timeout = setTimeout(() => {
      const posts = getPosts();
      const found = posts.find((p) => p.id.toString() === id);
      setPost(found || null);

      if (found) {
        const savedLikes = parseInt(localStorage.getItem(`likes-${id}`)) || 0;
        const savedComments = JSON.parse(localStorage.getItem(`comments-${id}`)) || [];
        const sessionComment = sessionStorage.getItem(`draft-${id}`) || '';
        setLikes(savedLikes);
        setComments(savedComments);
        setNewComment(sessionComment);
      }

      setLoading(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, [id]);

  const handleLike = () => {
    const updated = likes + 1;
    localStorage.setItem(`likes-${id}`, updated.toString());
    setLikes(updated);
  };

  const handleCommentChange = (e) => {
    const value = e.target.value;
    setNewComment(value);
    sessionStorage.setItem(`draft-${id}`, value);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newEntry = {
      id: Date.now(),
      name: author || 'Anonymous',
      text: newComment,
      time: new Date().toISOString(),
    };

    const updated = [...comments, newEntry];
    localStorage.setItem(`comments-${id}`, JSON.stringify(updated));
    setComments(updated);
    setNewComment('');
    sessionStorage.removeItem(`draft-${id}`);
    setVisibleComments((prev) => prev + 1);
  };

  const handleDeleteComment = (commentId) => {
    const updated = comments.filter((c) => c.id !== commentId);
    localStorage.setItem(`comments-${id}`, JSON.stringify(updated));
    setComments(updated);
  };

  const handleLoadMore = () => {
    setVisibleComments((prev) => prev + 3);
  };

  if (loading) {
    return (
      <div className="post-detail container">
        <p className="post-detail__loading">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-detail container">
        <h2>Post not found</h2>
        <Link to="/" className="post-detail__back-link">← Back to Home</Link>
      </div>
    );
  }

  const visible = comments.slice(0, visibleComments);

  return (
    <div className="post-detail container">
      <h1 className="post-detail__title">{post.title}</h1>

      <div className="post-detail__image-wrapper">
        <img
          src={post.image || getFallbackImage(post.title)}
          alt="Post visual"
          className="post-detail__image"
        />
      </div>

      <p className="post-detail__meta">
        <strong>Author:</strong> {post.author} &nbsp; | &nbsp;
        <strong>Category:</strong> {post.category} &nbsp; | &nbsp;
        <strong>Date:</strong> {new Date(post.createdAt).toLocaleDateString()}
      </p>

      <div className="post-detail__content">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      <div className="post-detail__likes">
        <button onClick={handleLike}>❤️ Like</button> {likes} likes
      </div>

      <div className="post-detail__comments">
        <h3>Comments</h3>
        {visible.length === 0 && <p>No comments yet.</p>}
        <ul>
          {visible.map((c) => (
            <li key={c.id} className="post-detail__comment animate">
              <div className="avatar">{getInitials(c.name)}</div>
              <div className="bubble">
                <div className="top">
                  <strong>{c.name}</strong>
                  <span className="time">{timeAgo(c.time)}</span>
                </div>
                <p>{c.text}</p>
                {c.name === author && (
                  <button className="delete-btn" onClick={() => handleDeleteComment(c.id)}>
                    Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>

        {visibleComments < comments.length && (
          <div className="post-detail__loadmore">
            <button onClick={handleLoadMore}>Load More</button>
          </div>
        )}

        <form onSubmit={handleCommentSubmit}>
          <textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={handleCommentChange}
            rows="3"
            required
          />
          <button type="submit">Post Comment</button>
        </form>
      </div>

      <Link to="/" className="post-detail__back-link">← Back to Home</Link>
    </div>
  );
}

export default PostDetail;
