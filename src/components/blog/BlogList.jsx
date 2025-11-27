import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../../services/api';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await blogAPI.getPosts();
        setPosts(response.data);
      } catch (err) {
        setError('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Blog Posts</h1>
      
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post._id} className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              <Link 
                to={`/post/${post._id}`}
                className="hover:text-blue-600"
              >
                {post.title}
              </Link>
            </h2>
            <p className="text-gray-600 mb-4">{post.excerpt || post.body?.substring(0, 150)}...</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>By {post.author?.name || 'Unknown'}</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
        
        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No blog posts yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;