import { useState } from 'react';
import CommentItem from './CommentItem';

const CommentList = ({ comments, currentUser, onUpdateComment, onDeleteComment }) => {
  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          currentUser={currentUser}
          onUpdateComment={onUpdateComment}
          onDeleteComment={onDeleteComment}
        />
      ))}
    </div>
  );
};

export default CommentList;