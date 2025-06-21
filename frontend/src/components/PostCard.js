import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { FiHeart, FiClock } from 'react-icons/fi';
import LoadingSpinner from './LoadingSpinner';

const PostCard = ({ post, onLike, currentUserId }) => {
  const [liking, setLiking] = useState(false);

  const handleLike = async () => {
    if (liking) return;
    
    setLiking(true);
    try {
      const response = await postsAPI.likePost(post.id);
      const updatedPost = response.data.post;
      onLike(post.id, updatedPost.likes_count);
    } catch (error) {
      console.error('Failed to like post:', error);
    } finally {
      setLiking(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="post-card">
      <div className="flex items-start space-x-3">
        <Link to={`/user/${post.user_id}`}>
          <img
            src={post.user_profile_picture || 'https://via.placeholder.com/40x40?text=U'}
            alt={post.user_name}
            className="avatar"
          />
        </Link>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <Link 
              to={`/user/${post.user_id}`}
              className="font-medium text-secondary-900 hover:text-primary-600 transition-colors duration-200"
            >
              {post.user_name}
            </Link>
            <span className="text-secondary-400">•</span>
            <div className="flex items-center text-sm text-secondary-500">
              <FiClock className="w-3 h-3 mr-1" />
              {formatDate(post.created_at)}
            </div>
          </div>
          
          <div className="text-secondary-800 mb-4 whitespace-pre-wrap">
            {post.content}
          </div>
          
          {post.image_url && (
            <div className="mb-4">
              <img
                src={post.image_url}
                alt="Post"
                className="w-full max-h-96 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <button
              onClick={handleLike}
              disabled={liking}
              className="like-button group"
            >
              {liking ? (
                <LoadingSpinner size="sm" />
              ) : (
                <FiHeart className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              )}
              <span className="font-medium">{post.likes_count}</span>
            </button>
            
            <div className="text-sm text-secondary-500">
              {post.likes_count === 1 ? '1 like' : `${post.likes_count} likes`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard; 