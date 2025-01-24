import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StarIcon, PhoneIcon, MapPinIcon, PencilIcon, CameraIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const ORDER_STATUSES = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'ON_PROGRESS', label: 'In Progress' },
    { value: 'DELIVERED', label: 'Delivered' }
  ];

const PP = () => {
  const [customerData, setCustomerData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [profileImage, setProfileImage] = useState(null);

  
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Add this state

  // Add these state variables at the beginning of your component
const [orders, setOrders] = useState([]);
const [selectedStatus, setSelectedStatus] = useState('PENDING');
const [orderLoading, setOrderLoading] = useState(false);

const fetchOrders = async (status) => {
  setOrderLoading(true);
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(
      `http://localhost:8080/customer/get-orders?orderStatus=${status}&sortBy=dateTime`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (response.data) {
      setOrders(response.data);
        console.log('Orders:', response.data);
    } else {
      setOrders([]);
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    showNotification('Failed to load orders', 'error');
    setOrders([]);
  } finally {
    setOrderLoading(false);
  }
};

  // Add this useEffect to fetch orders when status changes
useEffect(() => {
    if (customerData) {
      fetchOrders(selectedStatus);
    }
  }, [selectedStatus, customerData]);
// Add this JSX after your profile card div and before the notification


  useEffect(() => {
    fetchCustomerData();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const fetchCustomerData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.userId;

      const response = await axios.get(`http://localhost:8080/api/customer/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setCustomerData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching customer data:', err);
      setError('Failed to load profile data');
      showNotification('Failed to load profile data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (formData) => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!formData.name || !formData.address || !formData.phone) {
        showNotification('All fields are required', 'error');
        return;
      }

      const response = await axios.put(
        'http://localhost:8080/customer/update',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setCustomerData(prev => ({
          ...prev,
          name: formData.name,
          address: formData.address,
          phone: formData.phone
        }));
        showNotification('Profile updated successfully', 'success');
        setIsDialogOpen(false);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      showNotification('Failed to update profile', 'error');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString();
  };

  return (
    <>
      <style>
        {`
          @keyframes shrink {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}
      </style>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="md:flex p-6">
            <div className="relative w-32 h-32 p-6 rounded-full overflow-hidden border-2 border-gray-300">
              {profileImage ? (
                <img src={profileImage} alt={customerData?.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <CameraIcon className="h-32 w-32 text-gray-500" />
                </div>
              )}
            </div>

            <div className="ml-6">
              <div className="uppercase tracking-wide text-lg text-indigo-500 font-semibold">
                {customerData?.name}
              </div>
              <div className="mt-2 flex items-center text-gray-600">
                <MapPinIcon className="h-5 w-5 mr-2" />
                <span>{customerData?.address}</span>
              </div>
              <div className="mt-2 flex items-center text-gray-600">
                <PhoneIcon className="h-5 w-5 mr-2" />
                <span>{customerData?.phone}</span>
              </div>

              <div className="mt-4">
                <Dialog  open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                    Edit Profile
                    </Button>
                </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        handleProfileUpdate({
                          name: formData.get("name"),
                          address: formData.get("address"),
                          phone: formData.get("phone"),
                        });
                      }}
                    >
                      <div className="grid gap-4 py-4">
                        <div className="flex flex-col items-center">
                          <label htmlFor="profileImage" className="cursor-pointer">
                            <div className="w-24 h-24 rounded-full border-2 border-gray-300 overflow-hidden">
                              {profileImage ? (
                                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <CameraIcon className="h-8 w-8 text-gray-500" />
                                </div>
                              )}
                            </div>
                          </label>
                          <input type="file" id="profileImage" className="hidden" onChange={handleImageChange} />
                        </div>
                        <Input id="name" name="name" defaultValue={customerData?.name} placeholder="Name" />
                        <Input id="address" name="address" defaultValue={customerData?.address} placeholder="Address" />
                        <Input id="phone" name="phone" defaultValue={customerData?.phone} placeholder="Phone" />
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit">Save changes</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        {notification.show && (
          <div
            className={`fixed bottom-4 mr-[10rem] right-4 px-4 py-2 rounded-lg text-black font-medium shadow-lg 
              transform transition-all duration-500 ease-in-out 
              border-2 ${notification.type === 'success' ? 'border-green-500' : 'border-red-500'}
              bg-white`}
          >
            <div className="flex items-center">
              <span>{notification.message}</span>
              <div className="h-1 bg-gray-200 absolute bottom-0 left-0 right-0">
                <div
                  className={`h-full ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} 
                    transition-all duration-3000 ease-linear`}
                  style={{
                    width: '100%',
                    animation: 'shrink 3s linear forwards'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Orders Section */}
<div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">My Orders</h2>
    
    {/* Order Status Filter */}
    <div className="flex space-x-4 mb-6">
      {ORDER_STATUSES.map((status) => (
        <button
          key={status.value}
          onClick={() => setSelectedStatus(status.value)}
          className={`px-4 py-2 rounded-md transition-colors ${
            selectedStatus === status.value
              ? 'bg-[#de7f45] text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {status.label}
        </button>
      ))}
    </div>

    {/* Orders List */}
<div className="space-y-4">
  {orderLoading ? (
    <div className="text-center py-4">Loading orders...</div>
  ) : orders.length === 0 ? (
    <div className="text-center py-4 text-gray-500">
      No {selectedStatus.toLowerCase()} orders found
    </div>
  ) : (
    orders.map((order) => (
      <div
        key={order.id}
        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">Order #{order.id.substring(0, 8)}</h3>
            <p className="text-gray-600">
              Delivery Time: {new Date(order.deliveryTime).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            order.orderStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
            order.orderStatus === 'ON_PROGRESS' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
          }`}>
            {order.orderStatus === 'ON_PROGRESS' ? 'In Progress' : order.orderStatus}
          </span>
        </div>

        {/* Order Items */}
        <div className="mt-4 space-y-2">
          {order.orderItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="font-medium">Cake with {item.flavorName} Flavor</p>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity} × {item.flavorPrice} Tk × {item.weight} pounds
                  </p>
                </div>
              </div>
              <p className="font-medium">
                {(item.quantity * item.flavorPrice * item.weight).toFixed(2)} Tk
              </p>
            </div>
          ))}
        </div>

        {/* Special Requirements */}
        {order.specialRequirements && (
          <div className="mt-4 bg-gray-50 p-3 rounded-md">
            <p className="text-sm font-medium text-gray-700">Special Requirements:</p>
            <p className="text-sm text-gray-600">{order.specialRequirements}</p>
          </div>
        )}

        {/* Order Total */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Delivery Charge:</span>
              <span>{order.deliveryCharge.toFixed(2)} Tk</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Payment Method:</span>
              <span>{order.paymentMethod.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total Amount:</span>
              <span className="text-[#de7f45]">{order.price.toFixed(2)} Tk</span>
            </div>
          </div>
        </div>
      </div>
    ))
  )}
</div>
  </div>
</div>
      </div>
    </>
  );
};

export default PP;