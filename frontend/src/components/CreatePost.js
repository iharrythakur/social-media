import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { postsAPI } from '../services/api';
import { FiImage, FiSend, FiX } from 'react-icons/fi';
import LoadingSpinner from './LoadingSpinner';

const CreatePost = ({ onPostCreated }) => {
  const { userProfile } = useAuth();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    setLoading(true);
    
    try {
      const response = await postsAPI.createPost({
        content: content.trim(),
        image_url: imageUrl.trim() || null
      });
      
      const newPost = response.data.post;
      onPostCreated(newPost);
      
      // Reset form
      setContent('');
      setImageUrl('');
      setShowImageInput(false);
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    
    // Auto-hide image input if URL is cleared
    if (!url.trim()) {
      setShowImageInput(false);
    }
  };

  const removeImage = () => {
    setImageUrl('');
    setShowImageInput(false);
  };

  return (
    <div className="card">
      <div className="flex items-start space-x-3">
        <img
          src={userProfile?.profile_picture_url || 'https://via.placeholder.com/40x40?text=U'}
          alt="Profile"
          className="avatar"
        />
        
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="input-field resize-none"
              rows="3"
              maxLength="1000"
            />
            
            {showImageInput && (
              <div className="relative">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={handleImageUrlChange}
                  placeholder="Enter image URL"
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            )}
            
            {imageUrl && (
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowImageInput(!showImageInput)}
                  className="text-secondary-600 hover:text-primary-600 transition-colors duration-200"
                >
                  <FiImage className="w-5 h-5" />
                </button>
                <span className="text-sm text-secondary-500">
                  {content.length}/1000
                </span>
              </div>
              
              <button
                type="submit"
                disabled={loading || !content.trim()}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <FiSend className="w-4 h-4" />
                    <span>Post</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost; 