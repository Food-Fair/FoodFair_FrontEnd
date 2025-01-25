import React, { useState } from 'react';
import axios from 'axios';

const CreateFood = () => {
  const [foodData, setFoodData] = useState({
    name: '',
    description: '',
    category: '',
    subCategory: '',
    flavor: [{ flavorName: 'Default', price: '' }],
    weight: '1',
    addOns: [{ name: '', description: '', price: '' }],
    deliveryTimeInstruction: ''
  });
  const [images, setImages] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    foodId: null
  });

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFoodData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFlavorChange = (index, field, value) => {
    const newFlavors = [...foodData.flavor];
    newFlavors[index][field] = value;
    setFoodData(prev => ({
      ...prev,
      flavor: newFlavors
    }));
  };

  const addFlavor = () => {
    setFoodData(prev => ({
      ...prev,
      flavor: [...prev.flavor, { flavorName: '', price: '' }]
    }));
  };

  const handleAddOnsChange = (index, field, value) => {
    const newAddOns = [...foodData.addOns];
    newAddOns[index][field] = value;
    setFoodData(prev => ({
      ...prev,
      addOns: newAddOns
    }));
  };

  const addAddOn = () => {
    setFoodData(prev => ({
      ...prev,
      addOns: [...prev.addOns, { name: '', description: '', price: '' }]
    }));
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const resetForm = () => {
    setFoodData({
      name: '',
      description: '',
      category: '',
      subCategory: '',
      flavor: [{ flavorName: 'Default', price: '' }],
      weight: '1',
      addOns: [{ name: '', description: '', price: '' }],
      deliveryTimeInstruction: ''
    });
    setImages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    const foodDtoBlob = new Blob([JSON.stringify(foodData)], {
        type: 'application/json'
    });
    formData.append('foodDto', foodDtoBlob);
    
    for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
    }

    try {
        const token = localStorage.getItem('access_token');
        
        const response = await axios.post(
            'http://localhost:8080/admin/foodsCreate', 
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        
        showNotification('Food item created successfully!', 'success');
        resetForm();
    } catch (error) {
        showNotification(error.response?.data?.message || 'Failed to create food item', 'error');
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
        <div
          className={`fixed bottom-6 h-[4rem] w-[20rem] mr-[10rem] right-4 px-6 py-4 rounded-lg text-black shadow-lg 
            transform transition-all duration-500 ease-in-out 
            border-2 ${notification.type === 'success' ? 'border-green-500' : 'border-red-500'}
            bg-white`}
        >
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
      
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-900">Create New Food Item</h2>
            <p className="mt-1 text-sm text-gray-600">Fill in the details to create a new food item.</p>
          </div>

          {/* Basic Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={foodData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#de7f45] focus:outline-none focus:ring-1 focus:ring-[#de7f45]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="category"
                required
                value={foodData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#de7f45] focus:outline-none focus:ring-1 focus:ring-[#de7f45]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sub Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subCategory"
                required
                value={foodData.subCategory}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#de7f45] focus:outline-none focus:ring-1 focus:ring-[#de7f45]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Weight (in Pounds)
              </label>
              <input
                type="number"
                name="weight"
                value={foodData.weight}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#de7f45] focus:outline-none focus:ring-1 focus:ring-[#de7f45]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              required
              value={foodData.description}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#de7f45] focus:outline-none focus:ring-1 focus:ring-[#de7f45]"
            />
          </div>

          {/* Flavors Section */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Flavors <span className="text-red-500">*</span><small className='font'> (if not applicable, add a single flavor with the name 'Default')</small>
            </h3>
            <div className="space-y-4">
              {foodData.flavor.map((flavor, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="Flavor Name"
                    value={flavor.flavorName}
                    onChange={(e) => handleFlavorChange(index, 'flavorName', e.target.value)}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-[#de7f45] focus:outline-none focus:ring-1 focus:ring-[#de7f45]"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    required
                    value={flavor.price}
                    onChange={(e) => handleFlavorChange(index, 'price', e.target.value)}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-[#de7f45] focus:outline-none focus:ring-1 focus:ring-[#de7f45]"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addFlavor}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#de7f45] hover:bg-[#eaad87] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#de7f45]"
              >
                Add Flavor
              </button>
            </div>
          </div>

          {/* Add-ons Section (Optional) */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add-ons (Optional)</h3>
            <div className="space-y-4">
              {foodData.addOns.map((addOn, index) => (
                <div key={index} className="space-y-2">
                  <input
                    type="text"
                    placeholder="Add-on Name"
                    value={addOn.name}
                    onChange={(e) => handleAddOnsChange(index, 'name', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#de7f45] focus:outline-none focus:ring-1 focus:ring-[#de7f45]"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={addOn.description}
                    onChange={(e) => handleAddOnsChange(index, 'description', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#de7f45] focus:outline-none focus:ring-1 focus:ring-[#de7f45]"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={addOn.price}
                    onChange={(e) => handleAddOnsChange(index, 'price', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#de7f45] focus:outline-none focus:ring-1 focus:ring-[#de7f45]"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addAddOn}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#de7f45] hover:bg-[#eaad87] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#de7f45]"
              >
                Add Add-on
              </button>
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Images <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              multiple
              required
              onChange={handleImageChange}
              className="mt-1 block w-full"
              accept="image/*"
            />
          </div>

          {/* Delivery Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Delivery Time Instructions <span className="text-red-500">*</span>
            </label>
            <textarea
              name="deliveryTimeInstruction"
              required
              value={foodData.deliveryTimeInstruction}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#de7f45] focus:outline-none focus:ring-1 focus:ring-[#de7f45]"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#de7f45] hover:bg-[#eaad87] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#de7f45]"
              >
                Create Food Item
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFood;