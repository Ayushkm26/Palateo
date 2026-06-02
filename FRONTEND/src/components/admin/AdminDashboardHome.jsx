import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboardHome = () => {
  const [counts, setCounts] = useState({
    users: 0,
    blogs: 0,
    restaurants: 0,
    contacts: 0,
  });

  useEffect(() => {
    // Fetch all counts in parallel
    Promise.all([
      axios.get('http://localhost:5000/api/users'),
      axios.get('http://localhost:5000/api/blogs'),
      axios.get('http://localhost:5000/api/restaurants'),
      axios.get('http://localhost:5000/api/contact'),
    ]).then(([usersRes, blogsRes, restaurantsRes, contactsRes]) => {
      setCounts({
        users: Array.isArray(usersRes.data) ? usersRes.data.length : (usersRes.data.users?.length || 0),
        blogs: Array.isArray(blogsRes.data) ? blogsRes.data.length : (blogsRes.data.blogs?.length || 0),
        restaurants: Array.isArray(restaurantsRes.data) ? restaurantsRes.data.length : (restaurantsRes.data.restaurants?.length || 0),
        contacts: Array.isArray(contactsRes.data) ? contactsRes.data.length : (contactsRes.data.contacts?.length || 0),
      });
    }).catch(() => {
      setCounts({ users: 0, blogs: 0, restaurants: 0, contacts: 0 });
    });
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="text-4xl font-bold text-orange-500">{counts.users}</div>
          <div className="mt-2 text-lg font-medium text-gray-700">Total Users</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="text-4xl font-bold text-orange-500">{counts.blogs}</div>
          <div className="mt-2 text-lg font-medium text-gray-700">Total Blogs</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="text-4xl font-bold text-orange-500">{counts.restaurants}</div>
          <div className="mt-2 text-lg font-medium text-gray-700">Total Restaurants</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="text-4xl font-bold text-orange-500">{counts.contacts}</div>
          <div className="mt-2 text-lg font-medium text-gray-700">Contact Submissions</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
