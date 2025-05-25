import { useParams, Link } from 'react-router-dom';
import { getPosts } from '../utils/storage';
import ReactMarkdown from 'react-markdown';
import './styles/PostDetail.scss';

function PostDetail() {
  const { id } = useParams();
  const posts = getPosts();
  const post = posts.find((p) => p.id.toString() === id);

  if (!post) {
    return (
      <div className="post-detail container">
        <h2>Post not found</h2>
        <Link to="/" className="post-detail__back">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="post-detail container">
      <Link to="/" className="post-detail__back">← Back to Home</Link>
      <h1 className="post-detail__title">{post.title}</h1>
      {post.author && (
        <p className="post-preview__author">
          <strong>Author:</strong> {post.author}
        </p>
      )}

      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="post-detail__image"
        />
      )}

      <div className="post-detail__content">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      {post.tags?.length > 0 && (
        <p className="post-detail__tags">
          <strong>Tags:</strong> {post.tags.join(', ')}
        </p>
      )}
    </div>
  );
}

export default PostDetail;
