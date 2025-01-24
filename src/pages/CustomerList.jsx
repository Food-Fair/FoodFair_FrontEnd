import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:8080/admin/customers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCustomers(response.data);
    } catch (error) {
      showNotification('Failed to fetch customers', 'error');
    }
  };

  const handleDelete = async (userId) => {

    console.log("Deleting customer with id:", userId);
    
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        const token = localStorage.getItem('access_token');
        await axios.delete(`http://localhost:8080/admin/delete-customer/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        showNotification('Customer deleted successfully!', 'success');
        fetchCustomers();
      } catch (error) {
        showNotification('Failed to delete customer', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <style>
        {`
          @keyframes shrink {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}
      </style>

      {notification.show && (
        <div className={`fixed bottom-6 h-[4rem] w-[20rem] mr-[10rem] right-4 px-6 py-4 rounded-lg text-black shadow-lg 
          transform transition-all duration-500 ease-in-out 
          border-2 ${notification.type === 'success' ? 'border-green-500' : 'border-red-500'}
          bg-white`}>
          <div className="flex items-center h-full">
            <span className="text-lg font-normal leading-tight">
              {notification.message}
            </span>
            <div className="h-1 bg-gray-200 absolute bottom-0 left-0 right-0 rounded-b-lg">
              <div
                className={`h-full ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} 
                  transition-all duration-3000 ease-linear rounded-b-lg`}
                style={{
                  width: '100%',
                  animation: 'shrink 3s linear forwards'
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
          <p className="mt-1 text-sm text-gray-600">Manage your customer list</p>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {customer.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {customer.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {customer.address}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(customer.users.id)}
                        className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {customers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No customers found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerList;