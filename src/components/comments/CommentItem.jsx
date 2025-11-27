import { useState } from 'react';
import CommentForm from './CommentForm';

const CommentItem = ({ comment, currentUser, onUpdateComment, onDeleteComment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAuthor = currentUser && comment.author && currentUser.id === comment.author.id;

  const handleUpdate = async (updatedContent) => {
    const result = await onUpdateComment(comment.id, updatedContent);
    if (result.success) {
      setIsEditing(false);
    }
    return result;
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      setIsDeleting(true);
      await onDeleteComment(comment.id);
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isEditing) {
    return (
      <div className="bg-white border border-blue-200 rounded-lg p-4 shadow-sm">
        <CommentForm
          onSubmit={handleUpdate}
          initialValue={comment.content}
          onCancel={() => setIsEditing(false)}
          isEditing={true}
        />
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      {/* Comment Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {comment.author?.name?.charAt(0) || 'U'}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">
              {comment.author?.name || 'Unknown User'}
            </h4>
            <p className="text-sm text-gray-500">
              {formatDate(comment.createdAt)}
              {comment.updatedAt !== comment.createdAt && ' (edited)'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {isAuthor && (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              disabled={isDeleting}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>

      {/* Comment Content */}
      <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
        {comment.content}
      </div>
    </div>
  );
};

export default CommentItem;