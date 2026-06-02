import React, { useState } from 'react';
import { FiEdit3, FiUser, FiTag, FiImage, FiGrid, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';

function ShareBlog() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    tags: '',
    img: '',
    content: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author name is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.content.trim()) newErrors.content = 'Blog content is required';
    if (!formData.img.trim()) newErrors.img = 'Image URL is required';
    if (formData.content.trim().length < 100) newErrors.content = 'Content should be at least 100 characters';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const blogData = {
        ...formData,
        date: new Date().toISOString().split('T')[0],
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      console.log('Submitting blog data:', blogData); // Debug log

      const response = await axios.post('http://localhost:5000/api/blogs', blogData);
      console.log('Server response:', response.data); // Debug log
      
      setShowSuccess(true);
      // Reset form after successful submission
      setFormData({
        title: '',
        author: '',
        category: '',
        tags: '',
        img: '',
        content: ''
      });
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting blog:', error.response?.data || error.message);
      setErrors({ submit: 'Failed to submit blog. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    'Indian Cuisine',
    'Italian Cuisine',
    'Japanese Cuisine',
    'Thai Cuisine',
    'Mexican Cuisine',
    'Mediterranean Cuisine',
    'Korean Cuisine',
    'French Cuisine',
    'Vegan Cuisine',
    'Middle Eastern Cuisine',
    'Peruvian Cuisine',
    'Fusion Cuisine',
    'Plant-Based',
    'Food Trends',
    'Sustainability'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Share Your Food Blog</h1>
          
          {showSuccess && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg flex items-center text-green-700">
              <FiCheckCircle className="w-5 h-5 mr-2" />
              Blog submitted successfully!
            </div>
          )}

          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg text-red-700">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <div className="flex items-center gap-2">
                  <FiEdit3 className="w-5 h-5 text-orange-500" />
                  Blog Title
                </div>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${errors.title ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                placeholder="Enter your blog title"
              />
              {errors.title && <p className="mt-1 text-red-500 text-sm">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <div className="flex items-center gap-2">
                  <FiUser className="w-5 h-5 text-orange-500" />
                  Author Name
                </div>
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${errors.author ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                placeholder="Enter author name"
              />
              {errors.author && <p className="mt-1 text-red-500 text-sm">{errors.author}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <div className="flex items-center gap-2">
                  <FiGrid className="w-5 h-5 text-orange-500" />
                  Category
                </div>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${errors.category ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
              >
                <option value="">Select a category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-red-500 text-sm">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <div className="flex items-center gap-2">
                  <FiTag className="w-5 h-5 text-orange-500" />
                  Tags
                </div>
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter tags separated by commas (e.g., Italian, Pasta, Cooking Tips)"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <div className="flex items-center gap-2">
                  <FiImage className="w-5 h-5 text-orange-500" />
                  Image URL
                </div>
              </label>
              <input
                type="text"
                name="img"
                value={formData.img}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${errors.img ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                placeholder="Enter image URL"
              />
              {errors.img && <p className="mt-1 text-red-500 text-sm">{errors.img}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <div className="flex items-center gap-2">
                  <FiEdit3 className="w-5 h-5 text-orange-500" />
                  Blog Content
                </div>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="10"
                className={`w-full px-4 py-2 rounded-lg border ${errors.content ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                placeholder="Write your blog content here..."
              />
              {errors.content && <p className="mt-1 text-red-500 text-sm">{errors.content}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-6 rounded-lg text-white font-medium ${
                isSubmitting 
                  ? 'bg-orange-400 cursor-not-allowed' 
                  : 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700'
              } transition-colors duration-200`}
            >
              {isSubmitting ? 'Submitting...' : 'Share Blog'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ShareBlog; 