import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBlog, FaSpinner, FaTrash, FaEye, FaTimes } from 'react-icons/fa';

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blogs');
      if (response.data && response.data.blogs) {
        const sortedBlogs = response.data.blogs.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBlogs(sortedBlogs);
      } else {
        setBlogs([]);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blogs. Please try again later.');
      setLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await axios.delete(`http://localhost:5000/api/blogs/${blogId}`);
        setBlogs(blogs.filter(blog => blog._id !== blogId));
        alert('Blog deleted successfully');
      } catch (err) {
        console.error('Error deleting blog:', err);
        alert('Failed to delete blog. Please try again.');
      }
    }
  };

  const handleView = async (blogId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/blogs/${blogId}`);
      if (response.data && response.data.blog) {
        setSelectedBlog(response.data.blog);
        setShowModal(true);
      } else {
        throw new Error('Blog data not found');
      }
    } catch (err) {
      console.error('Error fetching blog details:', err);
      alert('Failed to load blog details. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FaSpinner className="animate-spin text-4xl text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <FaBlog className="text-orange-500 text-xl" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-800">{blog.title}</h3>
                  <p className="text-sm text-gray-600">By {blog.author}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-gray-700 line-clamp-3">{blog.content}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {formatDate(blog.createdAt)}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleView(blog._id)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="View Blog"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Delete Blog"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {blogs.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8 inline-block">
            <FaBlog className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No blogs found</p>
          </div>
        </div>
      )}

      {/* Blog View Modal */}
      {showModal && selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedBlog.title}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaTimes className="text-gray-600" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600">By {selectedBlog.author}</p>
                <p className="text-sm text-gray-500">{formatDate(selectedBlog.createdAt)}</p>
              </div>

              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap text-gray-700">{selectedBlog.content}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement; 