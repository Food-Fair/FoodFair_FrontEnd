import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const CreateFood = () => {
  const [foodData, setFoodData] = useState({
    name: '',
    description: '',
    category: '',
    subCategory: '',
    flavor: [{ flavorName: '', price: '' }],
    weight: '',
    addOns: [{ name: '', description: '', price: '' }],
    deliveryTimeInstruction: ''
  });
  const [images, setImages] = useState([]);

  // Handle input changes for basic fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFoodData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle flavor changes
  const handleFlavorChange = (index, field, value) => {
    const newFlavors = [...foodData.flavor];
    newFlavors[index][field] = value;
    setFoodData(prev => ({
      ...prev,
      flavor: newFlavors
    }));
  };

  // Add new flavor field
  const addFlavor = () => {
    setFoodData(prev => ({
      ...prev,
      flavor: [...prev.flavor, { flavorName: '', price: '' }]
    }));
  };

  // Handle add-ons changes
  const handleAddOnsChange = (index, field, value) => {
    const newAddOns = [...foodData.addOns];
    newAddOns[index][field] = value;
    setFoodData(prev => ({
      ...prev,
      addOns: newAddOns
    }));
  };

  // Add new add-on field
  const addAddOn = () => {
    setFoodData(prev => ({
      ...prev,
      addOns: [...prev.addOns, { name: '', description: '', price: '' }]
    }));
  };

  // Handle image files
  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  // Handle form submission
  // Frontend
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    
    // Convert foodData to JSON string and append to FormData
    const foodDtoBlob = new Blob([JSON.stringify(foodData)], {
        type: 'application/json'
    });
    formData.append('foodDto', foodDtoBlob);
    
    // Append images
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
        
        console.log('Food created successfully:', response.data);
    } catch (error) {
        console.error('Error creating food:', error);
    }
};

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create New Food Item</h2>

      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <label className="block mb-1">Name:</label>
          <input
            type="text"
            name="name"
            value={foodData.name}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1">Description:</label>
          <textarea
            name="description"
            value={foodData.description}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1">Category:</label>
          <input
            type="text"
            name="category"
            value={foodData.category}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1">Sub Category:</label>
          <input
            type="text"
            name="subCategory"
            value={foodData.subCategory}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Flavors */}
        <div>
          <label className="block mb-1">Flavors:</label>
          {foodData.flavor.map((flavor, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Flavor Name"
                value={flavor.flavorName}
                onChange={(e) => handleFlavorChange(index, 'flavorName', e.target.value)}
                className="border rounded p-2"
              />
              <input
                type="number"
                placeholder="Price"
                value={flavor.price}
                onChange={(e) => handleFlavorChange(index, 'price', e.target.value)}
                className="border rounded p-2"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addFlavor}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Flavor
          </button>
        </div>

        {/* Add-ons */}
        <div>
          <label className="block mb-1">Add-ons:</label>
          {foodData.addOns.map((addOn, index) => (
            <div key={index} className="space-y-2 mb-4">
              <input
                type="text"
                placeholder="Add-on Name"
                value={addOn.name}
                onChange={(e) => handleAddOnsChange(index, 'name', e.target.value)}
                className="w-full border rounded p-2"
              />
              <input
                type="text"
                placeholder="Description"
                value={addOn.description}
                onChange={(e) => handleAddOnsChange(index, 'description', e.target.value)}
                className="w-full border rounded p-2"
              />
              <input
                type="number"
                placeholder="Price"
                value={addOn.price}
                onChange={(e) => handleAddOnsChange(index, 'price', e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addAddOn}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Add-on
          </button>
        </div>

        {/* Images */}
        <div>
          <label className="block mb-1">Images:</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="w-full border rounded p-2"
            accept="image/*"
          />
        </div>

        {/* Weight */}
        <div>
          <label className="block mb-1">Weight (in Pounds):</label>
          <input
            type="number"
            name="weight"
            value={foodData.weight}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Delivery Time Instructions */}
        <div>
          <label className="block mb-1">Delivery Time Instructions:</label>
          <textarea
            name="deliveryTimeInstruction"
            value={foodData.deliveryTimeInstruction}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 bg-green-500 text-white px-6 py-2 rounded"
      >
        Create Food Item
      </button>
    </form>
  );
};

export default CreateFood;