import React, { useState } from 'react';
import { FaLock, FaEnvelope, FaUser, FaCreditCard, FaBell, FaGlobe } from 'react-icons/fa';

const Settings = ({ owner }) => {
  const [activeTab, setActiveTab] = useState('account');
  
  if (!owner) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg text-gray-500">Owner data not available</h3>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Account Information</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="username"
                        defaultValue={owner.username}
                        className="pl-10 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        readOnly
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        defaultValue={owner.email}
                        className="pl-10 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Update Account
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Change Password</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="currentPassword"
                        className="pl-10 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="newPassword"
                        className="pl-10 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="confirmPassword"
                        className="pl-10 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
        
      case 'payments':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Payment Methods</h3>
            <div className="border-b border-gray-200 pb-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaCreditCard className="text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">**** **** **** 4567</p>
                    <p className="text-sm text-gray-500">Expires 12/2024</p>
                  </div>
                </div>
                <span className="text-xs font-medium py-1 px-2 bg-green-100 text-green-800 rounded-full">Default</span>
              </div>
            </div>
            <button className="text-orange-500 hover:text-orange-700 text-sm font-medium">
              + Add New Payment Method
            </button>
          </div>
        );
        
      case 'notifications':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Notification Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaBell className="text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium">New Order Notifications</p>
                    <p className="text-sm text-gray-500">Receive notifications when a new order is placed</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaBell className="text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium">Order Status Updates</p>
                    <p className="text-sm text-gray-500">Receive notifications when an order status changes</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaBell className="text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium">Marketing Updates</p>
                    <p className="text-sm text-gray-500">Receive updates about promotions and new features</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            </div>
          </div>
        );
        
      case 'language':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Language Preferences</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                  Display Language
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaGlobe className="text-gray-400" />
                  </div>
                  <select
                    id="language"
                    className="pl-10 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="it">Italiano</option>
                  </select>
                </div>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            </form>
          </div>
        );
        
      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-lg text-gray-500">Select a settings category</h3>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Account Settings</h2>
      </div>

      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white rounded-lg shadow-md overflow-hidden">
          <nav className="flex flex-col">
            <button
              onClick={() => setActiveTab('account')}
              className={`flex items-center px-6 py-3 text-sm font-medium ${
                activeTab === 'account' 
                ? 'bg-orange-50 text-orange-500 border-l-4 border-orange-500' 
                : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FaUser className="mr-3" />
              Account Information
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`flex items-center px-6 py-3 text-sm font-medium ${
                activeTab === 'payments' 
                ? 'bg-orange-50 text-orange-500 border-l-4 border-orange-500' 
                : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FaCreditCard className="mr-3" />
              Payment Methods
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center px-6 py-3 text-sm font-medium ${
                activeTab === 'notifications' 
                ? 'bg-orange-50 text-orange-500 border-l-4 border-orange-500' 
                : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FaBell className="mr-3" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('language')}
              className={`flex items-center px-6 py-3 text-sm font-medium ${
                activeTab === 'language' 
                ? 'bg-orange-50 text-orange-500 border-l-4 border-orange-500' 
                : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FaGlobe className="mr-3" />
              Language & Region
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>

      <div className="p-4 text-center text-sm text-gray-500">
        This is a demo settings interface. In a real application, these settings would be saved to your account.
      </div>
    </div>
  );
};

export default Settings; 