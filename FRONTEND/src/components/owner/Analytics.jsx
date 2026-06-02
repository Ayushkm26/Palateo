import React from 'react';
import { FaChartLine, FaUtensils, FaUsers, FaMoneyBill } from 'react-icons/fa';

const Analytics = ({ restaurant }) => {
  // This is a placeholder component - in a real app, you would fetch actual analytics data
  
  // Mock data for demo purposes
  const salesData = [
    { day: 'Mon', sales: 450 },
    { day: 'Tue', sales: 580 },
    { day: 'Wed', sales: 690 },
    { day: 'Thu', sales: 890 },
    { day: 'Fri', sales: 1200 },
    { day: 'Sat', sales: 1500 },
    { day: 'Sun', sales: 1100 }
  ];

  const popularItems = [
    { name: 'Pizza Margherita', sales: 145, revenue: 1595 },
    { name: 'Burger & Fries', sales: 120, revenue: 1320 },
    { name: 'Pasta Carbonara', sales: 95, revenue: 1235 },
    { name: 'Chicken Salad', sales: 80, revenue: 960 },
    { name: 'Chocolate Cake', sales: 75, revenue: 375 }
  ];

  // Find the max value for scaling the chart
  const maxSales = Math.max(...salesData.map(day => day.sales));

  if (!restaurant) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg text-gray-500">Restaurant data not available</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <FaMoneyBill className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">$4,250</p>
              <p className="text-xs text-green-500">+12% from last week</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <FaUtensils className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">342</p>
              <p className="text-xs text-green-500">+8% from last week</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <FaUsers className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">New Customers</p>
              <p className="text-2xl font-bold">54</p>
              <p className="text-xs text-green-500">+15% from last week</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 mr-4">
              <FaChartLine className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Order Value</p>
              <p className="text-2xl font-bold">$12.42</p>
              <p className="text-xs text-red-500">-2% from last week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Sales Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Sales</h3>
        <div className="h-64 flex items-end space-x-2">
          {salesData.map(day => (
            <div key={day.day} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-blue-500 rounded-t"
                style={{ 
                  height: `${(day.sales / maxSales) * 80}%`, 
                  minHeight: '10%',
                  transition: 'height 0.3s ease' 
                }}
              ></div>
              <div className="text-xs font-medium mt-2">{day.day}</div>
              <div className="text-xs text-gray-500">${day.sales}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Items */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-700">Top Selling Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Units Sold
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Popularity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {popularItems.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.sales} units
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${item.revenue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-orange-500 h-2.5 rounded-full" 
                        style={{ width: `${(item.sales / popularItems[0].sales) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 text-center text-sm text-gray-500">
        This is a demo analytics dashboard. In a real application, this would connect to your analytics API.
      </div>
    </div>
  );
};

export default Analytics; 