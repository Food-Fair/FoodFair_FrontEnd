import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StarIcon, PhoneIcon, MapPinIcon, PencilIcon, CameraIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const PP = () => {
  const [customerData, setCustomerData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [profileImage, setProfileImage] = useState(null);

  
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Add this state


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
      </div>
    </>
  );
};

export default PP;