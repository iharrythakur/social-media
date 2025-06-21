import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userAPI, postsAPI } from '../services/api';
import { FiClock, FiUser, FiMail, FiFileText } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import PostCard from '../components/PostCard';

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadUserProfile();
    loadUserPosts();
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      const response = await userAPI.getUser(userId);
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const loadUserPosts = async (pageNum = 1) => {
    try {
      setPostsLoading(pageNum > 1);
      
      const response = await postsAPI.getUserPosts(userId, pageNum, 10);
      const newPosts = response.data.posts;
      
      if (pageNum === 1) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      
      setHasMore(newPosts.length === 10);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to load user posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!postsLoading && hasMore) {
      loadUserPosts(page + 1);
    }
  };

  const handlePostLiked = (postId, newLikesCount) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { ...post, likes_count: newLikesCount }
          : post
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="text-center py-12">
            <div className="text-red-400 text-6xl mb-4">😞</div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              User not found
            </h3>
            <p className="text-secondary-600">
              The user you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* User Profile Card */}
      <div className="card">
        <div className="flex items-start space-x-6">
          <img
            src={user.profile_picture_url || 'https://via.placeholder.com/120x120?text=U'}
            alt={user.name}
            className="avatar-xl"
          />
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              {user.name}
            </h1>
            
            <div className="space-y-3">
              <div className="flex items-center text-secondary-600">
                <FiMail className="w-4 h-4 mr-2" />
                <span>{user.email}</span>
              </div>
              
              {user.bio && (
                <div className="flex items-start text-secondary-800">
                  <FiFileText className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="whitespace-pre-wrap">{user.bio}</p>
                </div>
              )}
              
              <div className="flex items-center text-secondary-600">
                <FiClock className="w-4 h-4 mr-2" />
                <span>
                  Member since {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Posts */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-secondary-900">
          Posts by {user.name}
        </h2>
        
        {posts.length === 0 ? (
          <div className="card">
            <div className="text-center py-12">
              <div className="text-secondary-400 text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                No posts yet
              </h3>
              <p className="text-secondary-600">
                {user.name} hasn't shared any posts yet.
              </p>
            </div>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handlePostLiked}
                currentUserId={null}
              />
            ))}
            
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={postsLoading}
                  className="btn-outline"
                >
                  {postsLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    'Load More Posts'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile; 