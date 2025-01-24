// BlogListAndDetail.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const BlogListAndDetail = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/getAllBlogs');
      setBlogs(response.data);
    } catch (error) {
      showNotification('Failed to fetch blogs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogDetail = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/getBlog/${id}`);
      setSelectedBlog(response.data);
    } catch (error) {
      showNotification('Failed to fetch blog details', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode='wait'>
          {!selectedBlog ? (
            // Blog List View
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <motion.div
                    key={blog.id}
                    layoutId={`blog-${blog.id}`}
                    onClick={() => fetchBlogDetail(blog.id)}
                    className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    {blog.images && blog.images[0] && (
                      <div className="relative h-48">
                        <img
                          src={`http://localhost:8080/api/blogImage/${blog.images[0]}`}
                          alt="Blog cover"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <p className="text-gray-600 line-clamp-3">
                        {blog.description}
                      </p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                        <button className="text-[#de7f45] hover:text-[#c26835]">
                          Read more →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            // Blog Detail View
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto"
            >
              <button
                onClick={() => setSelectedBlog(null)}
                className="mb-8 flex items-center text-gray-600 hover:text-gray-900"
              >
                ← Back to Blogs
              </button>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {selectedBlog.images && selectedBlog.images.length > 0 && (
                  <div className="relative h-96">
                    <img
                      src={`http://localhost:8080/api/blogImage/${selectedBlog.images[0]}`}
                      alt="Blog cover"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-8">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {selectedBlog.description}
                    </p>
                  </div>

                  {/* Comments Section */}
                  <div className="mt-12">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Comments</h3>
                    {selectedBlog.comments && selectedBlog.comments.length > 0 ? (
                      <div className="space-y-6">
                        {selectedBlog.comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="bg-gray-50 rounded-lg p-6"
                          >
                            <p className="text-gray-700">{comment.description}</p>
                            <div className="mt-2 text-sm text-gray-500">
                              By {comment.users?.name || 'Anonymous'} •{' '}
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No comments yet.</p>
                    )}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>
                        Posted on {new Date(selectedBlog.createdAt).toLocaleDateString()}
                      </span>
                      {selectedBlog.updatedAt && selectedBlog.updatedAt !== selectedBlog.createdAt && (
                        <span>
                          Updated on {new Date(selectedBlog.updatedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification */}
        {notification.show && (
          <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-lg shadow-lg 
            transform transition-all duration-500 ease-in-out 
            ${notification.type === 'success' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
            <span className={`text-${notification.type === 'success' ? 'green' : 'red'}-700`}>
              {notification.message}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogListAndDetail;