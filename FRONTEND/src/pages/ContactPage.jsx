import React, { useState } from 'react';
import { FiUser, FiMail, FiMessageSquare, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
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
      await axios.post('http://localhost:5000/api/contact', formData);
      
      setShowSuccess(true);
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to submit message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5E4] pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 transform transition-all duration-300 hover:shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">We'd Love to Hear From You!</h1>
            <p className="text-gray-600">
              Have a question about our services or want to share your feedback? 
              We're here to help and would love to hear from you.
            </p>
          </div>
          
          {showSuccess && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg flex items-center justify-center text-green-700 transform animate-fade-in-down">
              <FiCheckCircle className="w-5 h-5 mr-2" />
              Thank you for your message! We'll get back to you soon.
            </div>
          )}

          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg text-red-700 text-center">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <div className="flex items-center gap-2">
                  <FiUser className="w-5 h-5 text-orange-500" />
                  Your Name
                </div>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200`}
                placeholder="Enter your name"
              />
              {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <div className="flex items-center gap-2">
                  <FiMail className="w-5 h-5 text-orange-500" />
                  Email Address
                </div>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <div className="flex items-center gap-2">
                  <FiMessageSquare className="w-5 h-5 text-orange-500" />
                  Your Message
                </div>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.message ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200`}
                placeholder="Write your message here..."
              />
              {errors.message && <p className="mt-1 text-red-500 text-sm">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-6 rounded-lg text-white font-medium ${
                isSubmitting 
                  ? 'bg-orange-400 cursor-not-allowed' 
                  : 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700'
              } transform transition-all duration-200 hover:scale-[1.02]`}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 