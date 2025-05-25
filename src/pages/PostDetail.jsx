import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPosts } from '../utils/storage';
import { getAuthorName } from '../utils/auth';
import ReactMarkdown from 'react-markdown';
import './styles/PostDetail.scss';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const author = getAuthorName();

  const getFallbackImage = (prompt = 'blog') =>
    `https://source.unsplash.com/800x400/?${encodeURIComponent(prompt)}`;

  // ✅ Update post and related data every time `id` changes
  useEffect(() => {
    const posts = getPosts();
    const found = posts.find((p) => p.id.toString() === id);
    setPost(found || null);

    if (found) {
      const savedLikes = parseInt(localStorage.getItem(`likes-${id}`)) || 0;
      const savedComments = JSON.parse(localStorage.getItem(`comments-${id}`)) || [];
      setLikes(savedLikes);
      setComments(savedComments);
    }
  }, [id]);

  const handleLike = () => {
    const updated = likes + 1;
    localStorage.setItem(`likes-${id}`, updated.toString());
    setLikes(updated);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newEntry = {
      name: author || 'Anonymous',
      text: newComment,
      time: new Date().toISOString(),
    };

    const updated = [...comments, newEntry];
    localStorage.setItem(`comments-${id}`, JSON.stringify(updated));
    setComments(updated);
    setNewComment('');
  };

  if (!post) {
    return (
      <div className="post-detail container">
        <h2>Post not found</h2>
        <Link to="/" className="post-detail__back-link">← Back to Home</Link>
      </div>
    );
  }

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
        {comments.length === 0 && <p>No comments yet.</p>}
        <ul>
          {comments.map((c, i) => (
            <li key={i}>
              <strong>{c.name}</strong>: {c.text}
            </li>
          ))}
        </ul>

        <form onSubmit={handleCommentSubmit}>
          <textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
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
