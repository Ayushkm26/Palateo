import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:5000/api/blogs/${id}`);
        
        if (!response.ok) {
          throw new Error(`Blog not found`);
        }
        
        const data = await response.json();
        if (!data || !data.blog || !data.blog.title) {
          throw new Error('Invalid blog data received');
        }
        setBlog(data.blog);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Error</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <Link
              to="/blogs"
              className="inline-flex items-center px-6 py-3 bg-orange-100 text-orange-700 font-medium rounded-lg hover:bg-orange-200 transition-colors duration-300"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Blogs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No date available';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getAuthorInitial = (author) => {
    return author && typeof author === 'string' ? author.charAt(0) : '?';
  };

  const renderContent = () => {
    if (!blog.content) return null;

    const paragraphs = blog.content.split('\n\n');
    const displayParagraphs = isExpanded ? paragraphs : paragraphs.slice(0, 2);
    
    return (
      <>
        {displayParagraphs.map((paragraph, index) => (
          <p key={index} className="leading-7 text-gray-700 mb-6">
            {paragraph}
          </p>
        ))}
        {paragraphs.length > 2 && (
          <div className="text-center mt-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center px-6 py-3 bg-orange-100 text-orange-700 font-medium rounded-lg hover:bg-orange-200 transition-colors duration-300"
            >
              {isExpanded ? (
                <>
                  Show Less
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </>
              ) : (
                <>
                  Read More
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white pt-20">
      <article className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
        {/* Back Button at Top */}
        <Link
          to="/blogs"
          className="inline-flex items-center px-4 py-2 mb-8 bg-orange-100 text-orange-700 font-medium rounded-lg hover:bg-orange-200 transition-colors duration-300"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Blogs
        </Link>

        {/* Hero Image */}
        <div className="relative mb-6">
          <img
            src={blog.img || '/default-blog-image.jpg'}
            alt={blog.title}
            className="w-full max-h-[400px] object-cover rounded-xl shadow-lg"
          />
          {blog.category && (
            <div className="absolute top-4 right-4">
              <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
                {blog.category}
              </span>
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-[#ff5722] mb-4 font-serif">
            {blog.title}
          </h1>

          {/* Author and Date */}
          <div className="flex items-center mb-8 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                <span className="text-orange-700 font-medium text-lg">
                  {getAuthorInitial(blog.author)}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-700">{blog.author || 'Anonymous'}</p>
                <p>{formatDate(blog.date)}</p>
              </div>
            </div>
            {blog.tags && blog.tags.length > 0 && (
              <div className="ml-auto flex gap-2">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Blog Content */}
          <div className="prose lg:prose-xl prose-orange max-w-none">
            {renderContent()}
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail; 