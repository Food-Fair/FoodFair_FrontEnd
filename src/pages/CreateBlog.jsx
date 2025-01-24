import React, { useState } from 'react';
import axios from 'axios';

const CreateBlog = () => {
  const [blogData, setBlogData] = useState({
    description: '',
  });
  const [images, setImages] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlogData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const resetForm = () => {
    setBlogData({
      description: '',
    });
    setImages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    const blogBlob = new Blob([JSON.stringify(blogData)], {
      type: 'application/json'
    });
    formData.append('blog', blogBlob);
    
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    try {
      const token = localStorage.getItem('access_token');
      
      const response = await axios.post(
        'http://localhost:8080/admin/createBlog', 
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      showNotification('Blog created successfully!', 'success');
      console.log("blog!!!"+response.data.description);
      resetForm();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to create blog', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <style>
        {`
          @keyframes shrink {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}
      </style>

      {notification.show && (
        <div className={`fixed bottom-6 h-[4rem] w-[20rem] mr-[10rem] right-4 px-6 py-4 rounded-lg text-black shadow-lg 
          transform transition-all duration-500 ease-in-out 
          border-2 ${notification.type === 'success' ? 'border-green-500' : 'border-red-500'}
          bg-white`}>
          <div className="flex items-center h-full">
            <span className="text-lg font-normal leading-tight">
              {notification.message}
            </span>
            <div className="h-1 bg-gray-200 absolute bottom-0 left-0 right-0 rounded-b-lg">
              <div
                className={`h-full ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} 
                  transition-all duration-3000 ease-linear rounded-b-lg`}
                style={{
                  width: '100%',
                  animation: 'shrink 3s linear forwards'
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-900">Create New Blog</h2>
            <p className="mt-1 text-sm text-gray-600">Share your thoughts and experiences.</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              required
              value={blogData.description}
              onChange={handleInputChange}
              rows={6}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#de7f45] focus:outline-none focus:ring-1 focus:ring-[#de7f45]"
              placeholder="Write your blog content here..."
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Images <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-[#de7f45] hover:text-[#eaad87] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#de7f45]"
                  >
                    <span>Upload files</span>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      required
                      onChange={handleImageChange}
                      className="sr-only"
                      accept="image/*"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#de7f45] hover:bg-[#eaad87] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#de7f45]"
              >
                Create Blog
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;