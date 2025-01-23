import React, { useState } from 'react';
import { StarIcon, PhoneIcon, MapPinIcon, PencilIcon,CameraIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialUser = {
  name: "Jane Doe",
  address: "123 Foodie Street, Tasty Town, FL 12345",
  phone: "+1 (555) 123-4567",
  image: "",
  orders: [
    { id: 1, restaurant: "Burger Palace", items: "Cheeseburger, Fries", total: "$15.99" },
    { id: 2, restaurant: "Pizza Heaven", items: "Pepperoni Pizza, Garlic Knots", total: "$22.50" },
  ],
  reviews: [
    { id: 1, restaurant: "Sushi Spot", rating: 5, comment: "Amazing sushi, fresh and delicious!" },
    { id: 2, restaurant: "Taco Town", rating: 4, comment: "Great tacos, but a bit pricey." },
  ],
};



const UserProfile = () => {
  const [user, setUser] = useState(initialUser);
  const [editingReview, setEditingReview] = useState(null);
const [profileImage, setProfileImage] = useState(user.image);
  const handleProfileUpdate = (updatedProfile) => {
    setUser(prevUser => ({ ...prevUser, ...updatedProfile }));
  };

  const handleReviewUpdate = (updatedReview) => {
    setUser(prevUser => ({
      ...prevUser,
      reviews: prevUser.reviews.map(review =>
        review.id === updatedReview.id ? { ...review, ...updatedReview } : review
      )
    }));
    setEditingReview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        handleProfileUpdate({ image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="md:flex p-6 ">
          <div className="relative w-32 h-32 p-6 rounded-full overflow-hidden border-2 border-gray-300">
            {profileImage ? (
              <img src={profileImage} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <CameraIcon className="h-32 w-32 text-gray-500" />
              </div>
            )}
          </div>
          <div className="ml-6">
            <div className="uppercase tracking-wide text-lg text-indigo-500 font-semibold">{user.name}</div>
            <div className="mt-2 flex items-center text-gray-600">
              <MapPinIcon className="h-5 w-5 mr-2" />
              <span>{user.address}</span>
            </div>
            <div className="mt-2 flex items-center text-gray-600">
              <PhoneIcon className="h-5 w-5 mr-2" />
              <span>{user.phone}</span>
            </div>
            <div className="mt-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Edit Profile</Button>
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
                      <Input id="name" name="name" defaultValue={user.name} placeholder="Name" />
                      <Input id="address" name="address" defaultValue={user.address} placeholder="Address" />
                      <Input id="phone" name="phone" defaultValue={user.phone} placeholder="Phone" />
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

        {/* Orders Section */}
        <div className="px-8 py-6 border-t border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {user.orders.map((order) => (
              <div key={order.id} className="bg-gray-50 p-4 rounded-md">
                <div className="font-semibold">{order.restaurant}</div>
                <div className="text-sm text-gray-600">{order.items}</div>
                <div className="text-sm font-semibold text-green-600">{order.total}</div>
              </div>
            ))}
          </div>
        </div>

    </div>
  );
};

export default UserProfile;
