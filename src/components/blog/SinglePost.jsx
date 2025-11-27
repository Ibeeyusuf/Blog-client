import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { blogAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CommentsSection from '../comments/CommentsSection';

const SinglePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await blogAPI.getPost(id);
        setPost(response.data);
      } catch (err) {
        setError('Post not found or failed to load');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await blogAPI.deletePost(id);
        navigate('/');
      } catch (err) {
        setError('Failed to delete post');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h2>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor = user && post.author && user.id === post.author.id;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Back button */}
      <Link 
        to="/" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Blog
      </Link>

      {/* Post content */}
      <article className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-8">
          {/* Post header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
            
            {/* Author and date info */}
            <div className="flex items-center justify-between text-gray-600 mb-6">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="font-semibold">
                    By {post.author?.name || post.author?.username || 'Unknown Author'}
                  </p>
                  {post.author?.email && (
                    <p className="text-sm text-gray-500">{post.author.email}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <time className="text-sm">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                {post.updatedAt !== post.createdAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    Updated: {new Date(post.updatedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-gray-600 italic border-l-4 border-blue-500 pl-4 py-2">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* Post content */}
          <div className="prose max-w-none mb-8">
            <div className="text-gray-800 leading-8 whitespace-pre-wrap">
              {post.body}
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons for author */}
          {isAuthor && (
            <div className="flex space-x-4 pt-6 border-t border-gray-200">
              <Link
                to={`/edit-post/${post.id}`}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit Post
              </Link>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Delete Post
              </button>
            </div>
          )}
        </div>
      </article>
        {/* Comments Section */}
      <CommentsSection postId={id} />
    </div>
  );
};

export default SinglePost;