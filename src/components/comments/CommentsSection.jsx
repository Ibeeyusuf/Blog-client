import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { commentsAPI } from '../../services/api';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

const CommentsSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await commentsAPI.getComments(postId);
      setComments(response.data);
    } catch (err) {
      setError('Failed to load comments');
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (commentText) => {
    try {
      const response = await commentsAPI.addComment(postId, {
        content: commentText
      });
      setComments(prev => [response.data, ...prev]);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: 'Failed to add comment' 
      };
    }
  };

  const handleUpdateComment = async (commentId, updatedContent) => {
    try {
      const response = await commentsAPI.updateComment(postId, commentId, {
        content: updatedContent
      });
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId ? response.data : comment
        )
      );
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: 'Failed to update comment' 
      };
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentsAPI.deleteComment(postId, commentId);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: 'Failed to delete comment' 
      };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">
        Comments ({comments.length})
      </h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Comment Form */}
      {isAuthenticated ? (
        <CommentForm onSubmit={handleAddComment} />
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">
            Please <a href="/login" className="text-blue-600 hover:text-blue-800 underline">login</a> to leave a comment.
          </p>
        </div>
      )}

      {/* Comments List */}
      <CommentList
        comments={comments}
        currentUser={user}
        onUpdateComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
      />

      {comments.length === 0 && !loading && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;