import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog } from '@/components/ui/dialog';

const FoodForm = ({ food, onSubmit, closeForm }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [category, setCategory] = useState(food?.category || '');
  const [flavors, setFlavors] = useState(food?.flavor || []);
  const [weight, setWeight] = useState(food?.weight || 1); // Single weight input
  const [addOns, setAddOns] = useState(food?.addOns || []);
  const [images, setImages] = useState(food?.images || []);

  // Handle file input changes and preview images
  const handleImageChange = (e) => {
    const files = e.target.files;
    const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
    setImages([...images, ...imageUrls]);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newFood = {
      name: formData.get('name'),
      description: formData.get('description'),
      category: category,
      subCategory: formData.get('subCategory'),
      flavor: flavors,
      weight: weight,
      addOns: addOns,
    };
  
    console.log("Submitting Food:", newFood); // Debugging output
  
    if (!newFood.name || !newFood.description) {
      console.error("Form validation failed: Name or description missing.");
      return;
    }
  
    // Create FormData for API request
    const apiFormData = new FormData();
    apiFormData.append('foodDto', JSON.stringify(newFood));
  
    // Append images to FormData
    const fileInput = e.target.querySelector('input[type="file"]');
    if (fileInput && fileInput.files.length > 0) {
      Array.from(fileInput.files).forEach(file => {
        apiFormData.append('images', file);
      });
    }
  
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(
        'http://localhost:8080/admin/foodsCreate',
        apiFormData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );
  
      if (response.status === 200 || response.status === 201) {
        onSubmit(response.data);
        closeDialog();
        setTimeout(() => {
          alert("Food saved successfully!");
        }, 1000);
      }
    } catch (error) {
      console.error("Error creating food:", error);
      alert(error.response?.data?.message || "Failed to create food. Please try again.");
    }
  };
  
  
  
  const handleAddFlavor = () => {
    setFlavors([...flavors, { name: '', price: 0 }]);
  };

  const handleRemoveFlavor = (index) => {
    setFlavors(flavors.filter((_, i) => i !== index));
  };

  const handleFlavorChange = (index, field, value) => {
    const newFlavors = [...flavors];
    newFlavors[index][field] = value;
    setFlavors(newFlavors);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="name" className="text-right">Name</label>
          <Input id="name" name="name" defaultValue={food?.name} className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="description" className="text-right">Description</label>
          <Textarea id="description" name="description" defaultValue={food?.description} className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="category" className="text-right">Category</label>
          <Select name="category" defaultValue={food?.category} onValueChange={setCategory}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cake">Cake</SelectItem>
              <SelectItem value="Pastry">Pastry</SelectItem>
              <SelectItem value="Bread">Bread</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="subCategory" className="text-right">Sub-category</label>
          <Input id="subCategory" name="subCategory" defaultValue={food?.subCategory} className="col-span-3" required />
        </div>

        {/* Flavors, Weight, Add-ons, Image Inputs */}
        <div className="grid grid-cols-4 items-center gap-4">
          <label className="text-right">Flavors</label>
          <div className="col-span-3">
            {flavors.map((flavor, index) => (
              <div key={index} className="flex items-center mt-2">
                <Input 
                  placeholder="Flavor name" 
                  value={flavor.name} 
                  onChange={(e) => handleFlavorChange(index, 'name', e.target.value)} 
                  className="mr-2" 
                />
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="Price" 
                  value={flavor.price} 
                  onChange={(e) => handleFlavorChange(index, 'price', parseFloat(e.target.value))} 
                  className="mr-2" 
                />
                <Button type="button" variant="destructive" onClick={() => handleRemoveFlavor(index)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" onClick={handleAddFlavor}>
              Add Flavor
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <label className="text-right">Weight (pound)</label>
          <div className="col-span-3">
            <Input 
              type="number" 
              step="0.1" 
              value={weight} 
              onChange={(e) => setWeight(parseFloat(e.target.value))} 
              className="mr-2" 
            />
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <label className="text-right">Add-ons</label>
          <div className="col-span-3">
            <Button type="button" onClick={() => setAddOns([...addOns, { name: '', price: 0 }])}>
              Add Add-on
            </Button>
            {addOns.map((addon, index) => (
              <div key={index} className="flex items-center mt-2">
                <Input 
                  placeholder="Add-on name" 
                  value={addon.name} 
                  onChange={(e) => {
                    const newAddOns = [...addOns];
                    newAddOns[index].name = e.target.value;
                    setAddOns(newAddOns);
                  }}
                  className="mr-2"
                />
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="Price" 
                  value={addon.price} 
                  onChange={(e) => {
                    const newAddOns = [...addOns];
                    newAddOns[index].price = parseFloat(e.target.value);
                    setAddOns(newAddOns);
                  }}
                  className="mr-2"
                />
                <Button type="button" variant="destructive" onClick={() => {
                  setAddOns(addOns.filter((_, i) => i !== index));
                }}>
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="grid grid-cols-4 items-center gap-4">
          <label className="text-right">Images</label>
          <div className="col-span-3">
            <Input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handleImageChange} 
              className="mr-2" 
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {images.map((image, index) => (
                <img key={index} src={image} alt={`Food Image ${index}`} className="w-20 h-20 object-cover" />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="button">Save Food</Button>
      </div>
    </form>
  );
};

export default FoodForm;
