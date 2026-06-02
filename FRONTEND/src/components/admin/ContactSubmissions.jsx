import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEnvelope, FaUser, FaSpinner, FaCalendar } from 'react-icons/fa';

const ContactSubmissions = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/contact');
        if (response.data && response.data.contacts) {
          // Sort contacts by date, newest first
          const sortedContacts = response.data.contacts.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          setContacts(sortedContacts);
        } else {
          setContacts([]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching contacts:', err);
        setError('Failed to load contact submissions. Please try again later.');
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

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
        {contacts.map((contact, index) => (
          <div
            key={contact._id || `contact-${index}-${Date.now()}`}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <FaUser className="text-orange-500 text-xl" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">{contact.name}</h3>
                <div className="flex items-center text-gray-600">
                  <FaEnvelope className="mr-2" />
                  <a href={`mailto:${contact.email}`} className="hover:text-orange-500">
                    {contact.email}
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
            </div>
            <div className="mt-4 text-sm text-gray-500 flex items-center">
              <FaCalendar className="mr-2" />
              {formatDate(contact.createdAt)}
            </div>
          </div>
        ))}
      </div>
      {contacts.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8 inline-block">
            <FaEnvelope className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No contact submissions yet</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactSubmissions; 