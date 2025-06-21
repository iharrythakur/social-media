import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { postsAPI } from '../services/api';
import { FiHeart, FiImage, FiSend } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';

const Home = () => {
  const { userProfile } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async (pageNum = 1) => {
    try {
      setLoading(pageNum === 1);
      setLoadingMore(pageNum > 1);
      
      const response = await postsAPI.getPosts(pageNum, 20);
      const newPosts = response.data.posts;
      
      if (pageNum === 1) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      
      setHasMore(newPosts.length === 20);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to load posts:', error);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadPosts(page + 1);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Create Post */}
      <CreatePost onPostCreated={handlePostCreated} />
      
      {/* Posts Feed */}
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        
        {posts.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="text-secondary-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              No posts yet
            </h3>
            <p className="text-secondary-600">
              Be the first to share something with the community!
            </p>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handlePostLiked}
                currentUserId={userProfile?.id}
              />
            ))}
            
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="btn-outline"
                >
                  {loadingMore ? (
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

export default Home; 