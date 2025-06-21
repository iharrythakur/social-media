import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiEdit2, FiSave, FiX, FiUser, FiMail, FiFileText, FiCamera } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import { storageAPI } from '../services/api';
import imageCompression from 'browser-image-compression';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const { userProfile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    bio: userProfile?.bio || '',
    profile_picture_url: userProfile?.profile_picture_url || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: userProfile?.name || '',
      bio: userProfile?.bio || '',
      profile_picture_url: userProfile?.profile_picture_url || ''
    });
    setIsEditing(false);
  };

  const handlePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    console.log('Starting picture upload...');
    console.log('User Profile Object:', userProfile);
    console.log('File to upload:', file);
    
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      console.log('Compressing image...');
      const compressedFile = await imageCompression(file, options);
      console.log('Image compressed. Compressed file:', compressedFile);
      console.log('Uploading with Firebase UID:', userProfile.firebase_uid);

      const downloadURL = await storageAPI.uploadProfilePicture(compressedFile, userProfile.firebase_uid);
      console.log('Upload successful. Download URL:', downloadURL);

      await updateProfile({ profile_picture_url: downloadURL });
    } catch (error) {
      console.error('FAILED TO UPLOAD PROFILE PICTURE:', error);
      console.error('Firebase Error Code:', error.code);
      console.error('Firebase Error Message:', error.message);
      toast.error(`Upload Failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-secondary-900">Profile</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-outline flex items-center space-x-2"
            >
              <FiEdit2 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={userProfile.profile_picture_url || `https://ui-avatars.com/api/?name=${userProfile.name}&background=random`}
                alt="Profile"
                className="avatar-xl"
              />
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handlePictureUpload}
                className="hidden"
                accept="image/png, image/jpeg"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                disabled={uploading}
                className="absolute -bottom-2 -right-2 bg-primary-600 text-white rounded-full p-2 hover:bg-primary-700 transition-all duration-200"
                aria-label="Change profile picture"
              >
                {uploading ? <LoadingSpinner size="sm" /> : <FiCamera className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              <FiUser className="w-4 h-4 inline mr-2" />
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your full name"
                required
              />
            ) : (
              <p className="text-secondary-900 text-lg">{userProfile.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              <FiMail className="w-4 h-4 inline mr-2" />
              Email
            </label>
            <p className="text-secondary-600">{userProfile.email}</p>
            <p className="text-sm text-secondary-500 mt-1">
              Email cannot be changed
            </p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              <FiFileText className="w-4 h-4 inline mr-2" />
              Bio
            </label>
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                className="input-field resize-none"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-secondary-800 whitespace-pre-wrap">
                {userProfile.bio || 'No bio yet'}
              </p>
            )}
          </div>

          {/* Member Since */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Member Since
            </label>
            <p className="text-secondary-600">
              {new Date(userProfile.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex items-center space-x-4 pt-4 border-t border-secondary-200">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center space-x-2"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <FiSave className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="btn-outline flex items-center space-x-2"
              >
                <FiX className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile; 