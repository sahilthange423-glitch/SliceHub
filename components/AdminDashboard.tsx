import React from 'react';
import { useStore } from '../store/StoreContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Package, DollarSign, Users, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { Badge, Button } from './Shared';

export const AdminDashboard: React.FC = () => {
  const { orders, updateOrderStatus, user, logout } = useStore();

  // Analytics Data Preparation
  const totalSales = orders.reduce((acc, order) => acc + order.total, 0);
  const activeOrders = orders.filter(o => o.status !== 'delivered').length;
  
  // Simple Mock Daily Sales Data
  const salesData = [
    { name: 'Mon', sales: 400 },
    { name: 'Tue', sales: 300 },
    { name: 'Wed', sales: 600 },
    { name: 'Thu', sales: 450 },
    { name: 'Fri', sales: 850 },
    { name: 'Sat', sales: 1200 },
    { name: 'Sun', sales: 900 },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
             <div className="bg-red-600 p-2 rounded-lg">
                <Package className="h-6 w-6 text-white" />
             </div>
             <h1 className="text-xl font-bold text-gray-900">SliceHub Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
             <span className="text-sm text-gray-500">Welcome, {user?.name}</span>
             <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard title="Total Revenue" value={`$${totalSales.toLocaleString()}`} icon={DollarSign} color="text-green-600" />
          <StatCard title="Active Orders" value={activeOrders.toString()} icon={Clock} color="text-orange-600" />
          <StatCard title="Total Customers" value="1,234" icon={Users} color="text-blue-600" />
          <StatCard title="Delivered Today" value="45" icon={CheckCircle} color="text-purple-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Sales Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Sales Analytics</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} prefix="$" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    cursor={{ fill: '#F3F4F6' }}
                  />
                  <Bar dataKey="sales" fill="#DC2626" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity / Status Legend or Mini List */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
             <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
             <div className="space-y-4">
               <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-red-500 hover:bg-red-50 transition-colors flex items-center justify-between group">
                  <span className="font-medium text-gray-700 group-hover:text-red-700">Update Menu Items</span>
                  <span className="text-gray-400 group-hover:text-red-500">→</span>
               </button>
               <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-red-500 hover:bg-red-50 transition-colors flex items-center justify-between group">
                  <span className="font-medium text-gray-700 group-hover:text-red-700">Manage Coupons</span>
                  <span className="text-gray-400 group-hover:text-red-500">→</span>
               </button>
               <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-red-500 hover:bg-red-50 transition-colors flex items-center justify-between group">
                  <span className="font-medium text-gray-700 group-hover:text-red-700">View Reviews</span>
                  <span className="text-gray-400 group-hover:text-red-500">→</span>
               </button>
             </div>
          </div>
        </div>

        {/* Order Management Table */}
        <div className="bg-white shadow-sm rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <div className="flex space-x-2">
               {/* Filter buttons could go here */}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.userId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">${order.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                        className="block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                      >
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="out-for-delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard: React.FC<{ title: string, value: string, icon: any, color: string }> = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white overflow-hidden shadow-sm rounded-xl p-5">
    <div className="flex items-center">
      <div className={`flex-shrink-0 ${color} bg-opacity-10 bg-current p-3 rounded-lg`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <div className="ml-5 w-0 flex-1">
        <dl>
          <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
          <dd className="text-2xl font-bold text-gray-900">{value}</dd>
        </dl>
      </div>
    </div>
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'preparing': 'bg-blue-100 text-blue-800',
    'out-for-delivery': 'bg-purple-100 text-purple-800',
    'delivered': 'bg-green-100 text-green-800',
  };
  const labels = {
    'pending': 'Pending',
    'preparing': 'Preparing',
    'out-for-delivery': 'On Way',
    'delivered': 'Delivered',
  };
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status as keyof typeof styles]}`}>
      {labels[status as keyof typeof labels]}
    </span>
  );
};
